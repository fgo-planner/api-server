import { CachedResponseMetadata, CacheKey } from 'internal';
import { MetadataKey } from '../metadata-key.constants';

type Decorator = (target: any, propertyKey: string) => void;

type CachedResponseParams = {
    key: string;
    subKey?: string;
    expiration?: number;
};

export function CachedResponse(key: CacheKey, subKey?: CacheKey, expiration?: number): Decorator {
    return (target: any, propertyKey: string) => {
        // Add cached response map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.CachedResponse, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.CachedResponse, {}, target.constructor);
        }

        // Register the cache metadata to the map.
        const routes: Record<string, CachedResponseMetadata> = Reflect.getMetadata(MetadataKey.CachedResponse, target.constructor);
        routes[propertyKey] = {
            key,
            subKey,
            expiration
        };
    };
}
