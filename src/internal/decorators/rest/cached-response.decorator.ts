import { CacheKey } from '../../types/cache-key.type';
import { CachedResponseMetadata } from '../../types/cached-response-metadata.type';
import { MetadataKey } from '../metadata-key.constants';

type Decorator = (target: any, propertyKey: string) => void;

type CachedResponseParams = {
    key: CacheKey;
    subKey?: CacheKey;
    expiresIn?: number;
};

/**
 * Helper function for parsing `CachedResponse` input parameters.
 */
const parseInputs = (param1: CacheKey, param2?: CacheKey | number, param3?: number): CachedResponseParams => {
    const key = param1;
    let subKey, expiresIn;
    if (typeof param2 === 'number') {
        subKey = undefined;
        expiresIn = param2;
    } else {
        subKey = param2;
        expiresIn = param3;
    }
    return { key, subKey, expiresIn };
};

/**
 * Decorator for indicating that the response returned by the route handler
 * method will be cached.
 *
 * Middleware functions will be added before and after this handler method
 * during route registration. This handler method will be skipped during calls
 * to the endpoint if a cached value present. Otherwise, the method is
 * responsible for placing the response body in the `res.locals.responseBody`
 * field and then calling the `next` function, which will then cache and send
 * the response.
 */
export function CachedResponse(key: CacheKey): Decorator;

/**
 * Decorator for indicating that the response returned by the route handler
 * method will be cached.
 *
 * Middleware functions will be added before and after this handler method
 * during route registration. This handler method will be skipped during calls
 * to the endpoint if a cached value present. Otherwise, the method is
 * responsible for placing the response body in the `res.locals.responseBody`
 * field and then calling the `next` function, which will then cache and send
 * the response.
 */
export function CachedResponse(key: CacheKey, subKey: CacheKey): Decorator;

/**
 * Decorator for indicating that the response returned by the route handler
 * method will be cached for a specified amount of time before expiring.
 *
 * Middleware functions will be added before and after this handler method
 * during route registration. This handler method will be skipped during calls
 * to the endpoint if a cached value present. Otherwise, the method is
 * responsible for placing the response body in the `res.locals.responseBody`
 * field and then calling the `next` function, which will then cache and send
 * the response.
 *
 * @param expiresIn How long the cached value will be valid for before expiring
 * (in milliseconds).
 */
export function CachedResponse(key: CacheKey, expiresIn: number): Decorator;

/**
 * `CachedResponse` function implementation.
 */
export function CachedResponse(param1: CacheKey, param2?: CacheKey | number, param3?: number): Decorator {
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
