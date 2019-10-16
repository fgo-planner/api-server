import { AccessTokenPayload } from '../token-payload.type';

/**
 * Extends the `Request` type provided by express.
 */
declare module 'express-serve-static-core' {
    interface Request {
        /**
         * The payload object parsed from the access token.
         */
        token?: AccessTokenPayload;
    }
}