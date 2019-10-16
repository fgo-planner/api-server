import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { UserModel } from '../../data/models/user/user.model';
import { AccessTokenPayload } from '../../internal';

@Service()
export class AuthenticationService {

    private readonly _BearerTokenPrefix = 'Bearer ';

    /**
     * Verifies provided user credentials, and genereates and returns a JWT access
     * token if the credentials are valid. If the credentials were not valid, then
     * null is returned.
     * 
     * @param adminOnly (optional, default = false) Only generate the access token
     *                  if the user is an admin. Otherwise, return null.
     */
    async generateAccessToken(username: string, password: string, adminOnly = false) {

        // Username and password must be provided.
        if (!username || !password) {
            return null;
        }

        // Find the user by the provided username.
        const user = await UserModel.findOne({ username: username }).exec();

        // If the user was not found, then return null.
        if (!user) {
            return null;
        }

        // If the adminOnly parameter was true, but the user is not an admin, then return null.
        if (adminOnly && !user.admin) {
            return null;
        }

        // If the hash compare failed, then return null.
        if (!(await bcrypt.compare(password, user.hash))) {
            return null;
        }

        // Create JWT body payload.
        const payload: AccessTokenPayload = {
            id: user._id,
            admin: user.admin
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS512' });
        return `${this._BearerTokenPrefix}${token}`;
    }

    /**
     * Middleware function for extracting access token payload if it is present in
     * the request. The extracted payload is stored in the `token` field of the
     * request object and can be accessed from `req.token` in subsequent handlers.
     * 
     * If the access token is missing or invalid, then the `req.token` field will
     * not be modified. This function will not send an error back to the client.
     */
    parseAccessToken(req: Request, res: Response, next: NextFunction) {
        // OPTIONS requests are skipped.
        if (req.method !== 'OPTIONS') {
            const payload = this._parseAccessTokenFromRequest(req);
            if (payload) {
                req.token = payload;
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
    authenticateAccessToken(req: Request, res: Response, next: NextFunction) {
        // Skip check on OPTIONS requests.
        if (req.method === 'OPTIONS') {
            next();
            return;
        } 
        
        const payload = this._parseAccessTokenFromRequest(req);
        if (payload) {
            req.token = payload;
            next();
        } else {
            res.status(401).send('Unauthorized');
        }
    }

    /**
     * Middleware function for check if the requestor is an admin user. 
     * `@authenticateAccessToken` must be called before this function.
     */
    authenticateAdminUser(req: Request, res: Response, next: NextFunction) {
        if (req.token && req.token.admin) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    }

    private _parseAccessTokenFromRequest(req: Request): AccessTokenPayload {
        let bearer = req.headers.authorization;
        if (!bearer) {
            return null;
        }
        if (bearer.indexOf(this._BearerTokenPrefix) === 0) {
            bearer = bearer.substring(this._BearerTokenPrefix.length);
        }
        return this._parseToken(bearer);
    }

    private _parseToken<T>(token: string): T {
        try {
            return jwt.verify(token, process.env.JWT_SECRET) as any;
        } catch {
            return null;
        }
    }

}