export class CacheEntry<T = any> {

    private readonly expiration?: number;

    constructor(readonly value: T, expiresIn?: number) {
        if (expiresIn) {
            this.expiration = new Date().getTime() + expiresIn;
        }
    }

    isExpired(): boolean {
        if (!this.expiration) {
            return false;
        }
        return new Date().getTime() > this.expiration;
    }

}