import { CacheKey } from './cache-key.type';

/**
 * Contains metadata for an endpoint's cached response invalidation handling.
 */
export type InvalidateCachedResponseMetadata = {

    key: CacheKey;

    subKey?: CacheKey;

    onStatus?: Array<number>;

};
