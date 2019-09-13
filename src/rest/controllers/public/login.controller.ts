import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { AuthenticationService } from '../../../services/user/authentication.service';
import { UserService } from '../../../services/user/user.service';

@Service()
export class LoginController {

    constructor(private _authService: AuthenticationService, private _userService: UserService) {

    }

    login(req: Request, res: Response, next: NextFunction) {
        this._authService.generateJwt(req.body.username, req.body.password).then(jwt => {
            if (!jwt) {
                return res.status(401).send('Invalid username or password.');
            }
            res.send(jwt);
        });
    }

    register(req: Request, res: Response, next: NextFunction) {
        this._userService.register(req.body.username, req.body.email, req.body.password).then(
            () => res.send('success'),
            err => res.status(400).send(err)
        );
    }

    requestPasswordReset(req: Request, res: Response, next: NextFunction) {
        // TODO Implement this
    }

}