import { CacheKey } from './cache-key.type';

/**
 * Contains metadata for an endpoint's cached response handling.
 */
export type CachedResponseMetadata = {

    key: CacheKey;

    subKey?: CacheKey;

    expiration?: number;

};
