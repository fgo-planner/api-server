import bcrypt from 'bcryptjs';
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { Service } from 'typedi';
import { UserModel } from '../../data/models/user/user.model';
import passport from 'passport';

@Service()
export class AuthenticationService {

    /**
     * Verifies provided user credentials, and genereates and returns a JSON
     * web token if the credentials are valid. If the credentials were not
     * valid, then null is returned.
     * 
     * @param adminOnly Only generate the JWT if the user is an admin.
     *                  Otherwise, return null.
     */
    async generateJwt(username: string, password: string, adminOnly = false) {

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
        const payload: any = {
            id: user._id,
            username: user.username,
            email: user.email,
            admin: user.admin
            // TODO Add more parameters
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS512' });
        return `Bearer ${token}`;
    }
    
    /**
     * Middleware function for authenticating a request against the JWT.
     */
    authenticateToken(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            // Skip check on OPTIONS requests.
            next();
        } else {
            passport.authenticate('jwt', { session: false })(req, res, next);
        }
    }

    /**
     * Middleware function for check if the requestor is an admin user. 
     * `@authenticateToken` must be called before this function.
     */
    authenticateAdminUser(req: Request, res: Response, next: NextFunction) {
        if ((req.user as any).admin) {
            next();
        } else {
            res.status(403).send('Forbidden');
        }
    }

}