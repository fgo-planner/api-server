import { NextFunction, Request, Response } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { Service } from 'typedi';
import { CacheKey } from '../types/cache-key.type';
import { CachedResponseMetadata } from '../types/cached-response-metadata.type';

type CacheMap = Map<CacheKey, Map<CacheKey | undefined, any>>;

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
            const cachedResponse = this._CacheMap.get(key)?.get(subKey);
            if (cachedResponse) {
                // console.log('Sending cached response...');
                res.setHeader('content-type', 'application/json'); // TODO Make this info part of the metadata
                res.send(cachedResponse);
            } else {
                next();
            }
        };

        const record = (req: Request, res: Response): void => {
            const { responseBody } = res.locals;
            if (responseBody) {
                // console.log('Caching response of type', typeof responseBody);
                let subCacheMap = this._CacheMap.get(key);
                if (!subCacheMap) {
                    this._CacheMap.set(key, subCacheMap = new Map());
                }
                subCacheMap.set(subKey, JSON.stringify(responseBody));
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
