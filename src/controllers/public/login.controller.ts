import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { PostMapping, RestController } from '../../internal/decorators/rest-controller.decorator';
import { AuthenticationService } from '../../services/user/authentication.service';
import { UserService } from '../../services/user/user.service';

@RestController('/login')
export class LoginController {

    @Inject()
    private _authService: AuthenticationService;

    @Inject()
    private _userService: UserService;

    @PostMapping()
    login(req: Request, res: Response, next: NextFunction) {
        this._authService.generateJwt(req.body.username, req.body.password).then(jwt => {
            if (!jwt) {
                return res.status(401).send('Invalid username or password.');
            }
            res.send(jwt);
        });
    }

    @PostMapping('/register')
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