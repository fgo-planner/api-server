import { CacheKey } from '../../types/cache-key.type';
import { CachedResponseMetadata } from '../../types/cached-response-metadata.type';
import { MetadataKey } from '../metadata-key.constants';
import { Request } from 'express';

type Decorator = (target: any, propertyKey: string) => void;

type CachedResponseParams = CachedResponseMetadata;

/**
 * Helper function for parsing `CachedResponse` input parameters.
 */
const parseInputs = (
    param1: CacheKey,
    param2?: CacheKey | ((req: Request) => CacheKey) | number,
    param3?: number
): CachedResponseParams => {
    const key = param1;
    let subKey, subKeyFn, expiresIn;
    if (typeof param2 === 'number') {
        subKey = undefined;
        subKeyFn = undefined;
        expiresIn = param2;
    } else if (typeof param2 === 'function') {
        subKey = undefined;
        subKeyFn = param2;
        expiresIn = param3;
    } else {
        subKey = param2;
        subKeyFn = undefined;
        expiresIn = param3;
    }
    return {
        key,
        subKey,
        subKeyFn,
        expiresIn
    };
};

/**
 * Decorator for indicating that the response returned by the route will be
 * cached, and the cached data will be returned for all subsequent requests to
 * the endpoint if available.
 */
export function CachedResponse(key: CacheKey): Decorator;

/**
 * Decorator for indicating that the response returned by the route will be
 * cached, and the cached data will be returned for all subsequent requests to
 * the endpoint if available.
 */
export function CachedResponse(key: CacheKey, subKey: CacheKey): Decorator;

/**
 * Decorator for indicating that the response returned by the route will be
 * cached, and the cached data will be returned for all subsequent requests to
 * the endpoint if available.
 */
export function CachedResponse(key: CacheKey, subKeyFn: (req: Request) => CacheKey): Decorator;

/**
 * Decorator for indicating that the response returned by the route will be
 * cached for a specified amount of time before expiring. The cached data will
 * be returned for all subsequent requests to the endpoint if it is still
 * available and has not expired yet.
 *
 * @param expiresIn How long the cached value will be valid for before expiring
 * (in milliseconds).
 */
export function CachedResponse(key: CacheKey, expiresIn: number): Decorator;

/**
 * `CachedResponse` function implementation.
 */
export function CachedResponse(param1: CacheKey, param2?: CacheKey | ((req: Request) => CacheKey) | number, param3?: number): Decorator {
    const params = parseInputs(param1, param2, param3);

    return (target: any, propertyKey: string) => {
        // Add cached response map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.CachedResponse, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.CachedResponse, {}, target.constructor);
        }

        // Register the cache metadata to the map.
        const routes: Record<string, CachedResponseMetadata> = Reflect.getMetadata(MetadataKey.CachedResponse, target.constructor);
        routes[propertyKey] = params;
    };
}
