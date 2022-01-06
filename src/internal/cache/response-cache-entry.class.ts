import { CacheEntry } from './cache-entry.class';

export class ResponseCacheEntry<T = any> extends CacheEntry<T> {

    constructor(value: T, readonly responseType: string, expiresIn?: number) {
        super(value, expiresIn);
    }

}
