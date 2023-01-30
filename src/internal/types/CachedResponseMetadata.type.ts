import { Request } from 'express';
import { CacheKey } from './CacheKey.type';

/**
 * Contains metadata for an endpoint's cached response handling.
 */
export type CachedResponseMetadata = {

    key: CacheKey;

    subKey?: CacheKey;

    /**
     * Function that returns a value to use in place of `subKey`. Has precedence if
     * both this and `subKey` are provided.
     */
    subKeyFn?(req: Request): CacheKey;

    expiresIn?: number;

};
