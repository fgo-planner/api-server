import { NextFunction, Request, Response } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { Service } from 'typedi';
import { CacheKey } from '../types/cache-key.type';
import { CachedResponseMetadata } from '../types/cached-response-metadata.type';
import { ResponseCacheEntry } from './response-cache-entry.class';

type CacheMap = Map<CacheKey, Map<CacheKey | undefined, ResponseCacheEntry>>;

type CachedResponseHandlers = {
    /**
     * Sends the cached value if available. Otherwise, calls the next function
     * (which should be the endpoint handler) instead.
     */
    send: RequestHandler<Dictionary<string>>;
    /**
     * Records the response body from the `res.locals.responseBody` field into the
     * cache and invokes `res.send` to send the response with the response body.
     */
    record: RequestHandler<Dictionary<string>>;
};

@Service()
export class ResponseCacheManager {

    private readonly _CacheMap: CacheMap = new Map();

    invalidateCache(key: CacheKey, subKey?: CacheKey): void {
        this._CacheMap.get(key)?.delete(subKey);
    }

    /**
     * Instantiate the cached response middleware handlers for the given metadata.
     */
    instantiateCachedResponseHandlers(metadata: CachedResponseMetadata): CachedResponseHandlers {
        // TODO Implement expiresIn
        const { key, subKey, expiresIn } = metadata;

        const send = (req: Request, res: Response, next: NextFunction): void => {
            const subCacheMap = this._CacheMap.get(key);
            if (!subCacheMap) {
                return next();
            }
            const cachedResponse = subCacheMap.get(subKey);
            if (!cachedResponse) {
                return next();
            }
            if (cachedResponse.isExpired()) {
                subCacheMap.delete(subKey);
                return next();
            }
            const { value, responseType } = cachedResponse;
            // console.log('Sending cached response...');
            res.setHeader('content-type', responseType);
            res.send(value);
        };

        const record = (req: Request, res: Response): void => {
            const { responseBody } = res.locals;
            if (responseBody) {
                // console.log('Caching response of type', typeof responseBody);
                let subCacheMap = this._CacheMap.get(key);
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
                // TODO Check if response is already sent by previous function(s).
                res.send(responseBody);
            } else {
                // TODO Check if response is already sent by previous function(s).
                // TODO Maybe send error instead?
                res.send(null);
            }
        };

        return { send, record };
    }

}
