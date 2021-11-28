import crypto from 'crypto';

export class RandomUtils {

    private static readonly _Characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    /**
     * Uses the Node.JS Crypto API to generate a random string of the given length
     * consisting of alphanumeric characters.
     */
    static randomString(length: number): string {
        let result = '';
        const numChars = RandomUtils._Characters.length;
        for (let i = 0; i < length; i++) {
            const index = crypto.randomInt(numChars);
            result += RandomUtils._Characters.charAt(index);
        }
        return result;
    }

}
