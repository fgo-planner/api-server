import { CacheKey } from '../../types/cache-key.type';
import { InvalidateCachedResponseMetadata } from '../../types/invalidate-cached-response-metadata.type';
import { MetadataKey } from '../metadata-key.constants';

type Decorator = (target: any, propertyKey: string) => void;

type InvalidateCachedResponseParams = InvalidateCachedResponseMetadata;

/**
 * Helper function for parsing `CachedResponse` input parameters.
 */
const parseInputs = (param1: CacheKey, param2?: CacheKey | Array<number>, param3?: Array<number>): InvalidateCachedResponseParams => {
    const key = param1;
    let subKey, onStatus;
    if (Array.isArray(param2)) {
        subKey = undefined;
        onStatus = param2;
    } else {
        subKey = param2;
        onStatus = param3;
    }
    return { key, subKey, onStatus };
};

export function InvalidateCachedResponse(key: CacheKey): Decorator;

export function InvalidateCachedResponse(key: CacheKey, subKey: CacheKey): Decorator;

export function InvalidateCachedResponse(key: CacheKey, onStatus: Array<number>): Decorator;

export function InvalidateCachedResponse(key: CacheKey, subKey: CacheKey, onStatus: Array<number>): Decorator;

/**
 * `InvalidateCachedResponse` function implementation.
 */
export function InvalidateCachedResponse(param1: CacheKey, param2?: CacheKey | Array<number>, param3?: Array<number>): Decorator {
    const params = parseInputs(param1, param2, param3);

    return (target: any, propertyKey: string) => {
        // Add invalidate cached response map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.InvalidateCachedResponse, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.InvalidateCachedResponse, {}, target.constructor);
        }

        // Register the cache metadata to the map.
        const routes: Record<string, InvalidateCachedResponseMetadata> =
            Reflect.getMetadata(MetadataKey.InvalidateCachedResponse, target.constructor);
        routes[propertyKey] = params;
    };
}
