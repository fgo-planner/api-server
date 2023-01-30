import { CacheKey } from '../../types/CacheKey.type';
import { InvalidateCachedResponseMetadata } from '../../types/InvalidateCachedResponseMetadata.type';
import { MetadataKey } from '../MetadataKeyConstants';

type Decorator = (target: any, propertyKey: string) => void;

export function InvalidateCachedResponse(key: CacheKey): Decorator;

export function InvalidateCachedResponse(key: CacheKey, onStatus: Array<number>): Decorator;

/**
 * `InvalidateCachedResponse` function implementation.
 */
export function InvalidateCachedResponse(key: CacheKey, onStatus?: Array<number>): Decorator {

    return (target: any, propertyKey: string) => {
        // Add invalidate cached response map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.InvalidateCachedResponse, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.InvalidateCachedResponse, {}, target.constructor);
        }

        // Register the cache metadata to the map.
        const routes: Record<string, InvalidateCachedResponseMetadata> =
            Reflect.getMetadata(MetadataKey.InvalidateCachedResponse, target.constructor);
        routes[propertyKey] = { key, onStatus };
    };
}
