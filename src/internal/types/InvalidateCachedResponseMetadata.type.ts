import { CacheKey } from './CacheKey.type';

/**
 * Contains metadata for an endpoint's cached response invalidation handling.
 */
export type InvalidateCachedResponseMetadata = {

    key: CacheKey;

    onStatus?: Array<number>;

};
