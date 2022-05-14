import { NextFunction, Request, Response } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { Service } from 'typedi';
import { CacheKey } from '../types/cache-key.type';
import { CachedResponseMetadata } from '../types/cached-response-metadata.type';
import { InvalidateCachedResponseMetadata } from '../types/invalidate-cached-response-metadata.type';
import { ResponseCacheEntry } from './response-cache-entry.class';

type CacheMap = Map<CacheKey, Map<CacheKey | undefined, ResponseCacheEntry>>;

@Service()
export class ResponseCacheManager {

    private readonly _CacheMap: CacheMap = new Map();

    invalidateCache(key: CacheKey, subKey?: CacheKey): void {
        this._CacheMap.get(key)?.delete(subKey);
    }

    /**
     * Instantiate the middleware handler using given metadata for a route decorated
     * with the `CachedResponse` decorator.
     *
     * The returned handler is responsible for retrieving and sending the cached
     * value if possible. When a cached value is not available, then it will
     * override the `res.send` method so that it can obtain and cache the response
     * value when it is invoked by the endpoint handler.
     */
    getCachedResponseHandler({ key, subKey, expiresIn }: CachedResponseMetadata): RequestHandler<Dictionary<string>> {

        const cachedResponseHandler = (_: Request, res: Response, next: NextFunction): void => {

            let subCacheMap = this._CacheMap.get(key);

            if (subCacheMap) {
                const cachedResponse = subCacheMap.get(subKey);
                if (cachedResponse) {
                    if (cachedResponse.isExpired()) {
                        /*
                         * Delete the cached value if it is expired.
                         */
                        subCacheMap.delete(subKey);
                    } else {
                        /**
                         * Send the cached value. The next function is not called.
                         */
                        res.setHeader('content-type', 'application/json'); // TODO Un-hardcode this.
                        res.send(cachedResponse.value);
                        return;
                    }
                }
            }

            /**
             * The original `res.send` function.
             */
            const send = res.send;

            /*
             * Override the default `res.send` function so that we can listen in and cache
             * the returned value when it is called in the next function.
             */
            res.send = (...args): Response => {
                const responseBody = args[0];
                /*
                 * Only cache the value if the response status is 200.
                 */
                if (res.statusCode === 200) {
                    if (!subCacheMap) {
                        this._CacheMap.set(key, subCacheMap = new Map());
                    }
                    let cachedValue, responseType;
                    if (typeof responseBody === 'string') {
                        cachedValue = responseBody;
                        responseType = 'text/plain';
                    } else {
                        cachedValue = JSON.stringify(responseBody);
                        responseType = 'application/json';
                    }
                    subCacheMap.set(subKey, new ResponseCacheEntry(cachedValue, responseType, expiresIn));
                }
                /*
                 * Call the original `res.send` function using the same parameters.
                 */
                return send.apply(res, args);
            };

            /*
             * Call the next function.
             */
            next();
        };

        return cachedResponseHandler;
    }

    /**
     * Instantiate the middleware handler using given metadata for a route decorated
     * with the `InvalidateCachedResponse` decorator.
     *
     * The returned handler is responsible for invalidating the cached value if it
     * is present.
     */
    getInvalidateCachedResponseHandler({ key, subKey, onStatus }: InvalidateCachedResponseMetadata): RequestHandler<Dictionary<string>> {

        const invalidateCache = this.invalidateCache.bind(this);

        const invalidateCachedResponseHandler = (_: Request, res: Response, next: NextFunction): void => {

            /**
             * The original `res.send` function.
             */
            const send = res.send;

            /**
             * Override the default `res.send` function so that we can listen in and perform
             * the cache invalidation when it is called in the next function.
             */
            res.send = (...args): Response => {
                /*
                 * Only perform the cache invalidation is the response code matches the
                 * configured status codes (or if no specific status codes were configured).
                 */
                if (!onStatus || onStatus.includes(res.statusCode)) {
                    invalidateCache(key, subKey);
                }
                /*
                 * Call the original `res.send` function using the same parameters.
                 */
                return send.apply(res, args);
            };

            /*
             * Call the next function.
             */
            next();
        };

        return invalidateCachedResponseHandler;
    }


}
