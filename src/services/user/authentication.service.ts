import { UserModel } from '@fgo-planner/data-mongo';
import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import { AccessTokenPayload, AuthenticatedRequest } from 'internal';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { RandomUtils } from 'utils';

type LoginCredentials = {
    username: string;
    password: string;
};

type AccessTokens = {
    token: string;
    redundantToken?: string;
};

@Service()
export class AuthenticationService {

    private static readonly _BearerTokenPrefix = 'Bearer ';

    private static readonly _SignatureAlgorithm = 'HS256';

    /**
     * Name of the cookie access token.
     */
    static readonly AccessTokenCookieName = 'fgoplanner_accesstoken';

    private __jwtSecret?: string;
    private get _jwtSecret(): string {
        if (this.__jwtSecret !== undefined) {
            return this.__jwtSecret;
        }
        this.__jwtSecret = process.env.JWT_SECRET;
        if (!this.__jwtSecret) {
            console.error('JWT secret was not configured for this environment.');
            this.__jwtSecret = '';
        }
        return this.__jwtSecret;
    }

    private __jwtSecretRedundant?: string;
    private get _jwtSecretRedundant(): string {
        if (this.__jwtSecretRedundant !== undefined) {
            return this.__jwtSecretRedundant;
        }
        this.__jwtSecretRedundant = process.env.JWT_SECRET;
        if (!this.__jwtSecretRedundant) {
            console.error('Redundant JWT secret was not configured for this environment.');
            this.__jwtSecretRedundant = '';
        }
        return this.__jwtSecretRedundant;
    }


    //#region Token production methods

    /**
     * Verifies provided user credentials, and generates and returns JWT access
     * tokens if the credentials are valid. If the credentials were not valid, then
     * null is returned.
     *
     * @param includeRedundantToken Whether to generate a additional token with same
     * payload (minus timestamps) that can be used as a cookie token, etc.
     *
     * @param adminOnly (optional, default = false) Only generate the access token
     * if the user is an admin. Otherwise, return null.
     */
    async generateAccessToken(
        { username, password }: LoginCredentials,
        includeRedundantToken: boolean,
        adminOnly = false
    ): Promise<AccessTokens | null> {

        /*
         * Username and password must be provided.
         */
        if (!username || !password) {
            return null;
        }

        /*
         * Find the user by the provided username. Return null if the user could not be
         * found.
         */
        const user = await UserModel.findOne({ username });
        if (!user) {
            return null;
        }

        /*
         * If the adminOnly parameter was true, but the user is not an admin, then
         * return null.
         */
        if (adminOnly && !user.admin) {
            return null;
        }

        /*
         * Validate password against the hash and return null if it failed.
         */
        const passwordValid = await bcrypt.compare(password, user.hash ?? '');
        if (!passwordValid) {
            return null;
        }

        /**
         * The JWT body payload.
         */
        const payload: AccessTokenPayload = {
            id: user._id.toHexString(),
            admin: user.admin
        };
        try {
            return this._generateAccessTokens(payload, includeRedundantToken);
        } catch (e) {
            console.error(e);
            return null;
        }
    }

    private _generateAccessTokens(tokenPayload: AccessTokenPayload, includeRedundantToken: boolean): AccessTokens {

        let token, redundantToken;

        if (includeRedundantToken) {
            /**
             * A randomly generated identification string that is included in both the main
             * and redundant tokens to verify that they were generated at the same time.
             */
            const jwtid = RandomUtils.randomString(10); // TODO Un-hardcode the length

            token = jwt.sign(tokenPayload, this._jwtSecret, {
                algorithm: AuthenticationService._SignatureAlgorithm,
                jwtid
            });

            redundantToken = jwt.sign(tokenPayload, this._jwtSecretRedundant, {
                algorithm: AuthenticationService._SignatureAlgorithm,
                jwtid,
                noTimestamp: true
            });
        } else {
            token = jwt.sign(tokenPayload, this._jwtSecret, {
                algorithm: AuthenticationService._SignatureAlgorithm
            });
        }
        
        // redundantToken = `${AuthenticationService._BearerTokenPrefix}${redundantToken}`;
        token = `${AuthenticationService._BearerTokenPrefix}${token}`;

        return { token, redundantToken };
    }

    //#endregion


    //#region Token consumption methods

    /**
     * Middleware function for extracting access token payload if it is present in
     * the request. The extracted payload is stored in the `token` field of the
     * request object and can be accessed from `req.token` in subsequent handlers.
     * 
     * If the access token is missing or invalid, then the `req.token` field will
     * not be modified. This function will not send an error back to the client.
     */
    parseAccessToken(req: Request, res: Response, next: NextFunction): void {
        // OPTIONS requests are skipped.
        if (req.method !== 'OPTIONS') {
            const payload = this._parseTokenFromRequestHeaders(req);
            // TODO Validate against redundant token
            if (payload) {
                (req as AuthenticatedRequest).token = payload;
            }
        }
        next();
    }

    /**
     * Middleware function for authenticating a request based on the attached
     * access token. The payload form the access token will be stored in the
     * `token` field of the request object and can be accessed from `req.token` in
     * subsequent handlers.
     * 
     * If the access token is missing or invalid, then an Unauthorized error will
     * be sent back to the client.
     */
    authenticateAccessToken(req: Request, res: Response, next: NextFunction): any {
        /*
         * Skip authentication check for OPTIONS requests.
         */
        if (req.method === 'OPTIONS') {
            return next();
        }

        const payload = this._parseTokenFromRequestHeaders(req);
        if (!payload) {
            return res.status(401).send('Unauthorized');
        }

        /*
         * If the token payload contains a jti claim, then it was generate with a
         * redundant token. Check the cookies for the redundant token and verify it.
         */
        if (payload.jti) {
            const redundantToken = req.cookies[AuthenticationService.AccessTokenCookieName];
            const redundantPayload = this._parseAccessToken(redundantToken, this._jwtSecretRedundant);
            if (!redundantPayload || redundantPayload.jti !== payload.jti) {
                return res.status(401).send('Unauthorized');
            }
        }

        (req as AuthenticatedRequest).token = payload;
        next();
    }

    /**
     * Middleware function for check if the requestor is an admin user. 
     * `authenticateAccessToken` must be called before this function.
     */
    authenticateAdminUser(req: Request & { token?: AccessTokenPayload }, res: Response, next: NextFunction): void {
        if (req.token && req.token.admin) {
            return next();
        }
        res.status(403).send('Forbidden');
    }

    private _parseTokenFromRequestHeaders(req: Request): AccessTokenPayload | null {
        const token = req.headers.authorization;
        return this._parseAccessToken(token, this._jwtSecret);
    }

    private _parseAccessToken(token: string | undefined, secret: string): AccessTokenPayload | null {
        if (!token) {
            return null;
        }
        if (token.indexOf(AuthenticationService._BearerTokenPrefix) === 0) {
            token = token.substring(AuthenticationService._BearerTokenPrefix.length);
        }
        return this._parseToken(token, secret);
    }

    private _parseToken<T>(token: string, secret: string): T | null {
        try {
            return jwt.verify(token, secret) as any;
        } catch {
            return null;
        }
    }

    //#endregion

}
