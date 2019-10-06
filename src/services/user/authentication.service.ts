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
     */
    async generateJwt(username: string, password: string) {

        console.log(username, password);

        // Username and password must be provided.
        if (!username || !password) {
            return null;
        }

        // Find the user by the provided username.
        const user = await UserModel.findOne({ username: username }).exec();

        // If the user was not found or the hash compare failed, then return null.
        if (!user || !(await bcrypt.compare(password, user.hash))) {
            return null;
        }

        // Create JWT body payload.
        const payload = {
            id: user._id,
            username: user.username,
            email: user.email
            // TODO Add more parameters
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, { algorithm: 'HS512' });
        return `Bearer ${token}`;
    }
    
    authenticateToken(req: Request, res: Response, next: NextFunction) {
        if (req.method === 'OPTIONS') {
            // Skip check on OPTIONS requests.
            next();
        } else {
            passport.authenticate('jwt', { session: false })(req, res, next);
        }
    }

}