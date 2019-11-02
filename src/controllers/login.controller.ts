import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { AuthenticationService, UserService } from 'services';
import { Inject } from 'typedi';

@RestController('/login', UserAccessLevel.Public)
export class LoginController {

    @Inject()
    private _authService: AuthenticationService;

    @Inject()
    private _userService: UserService;

    @PostMapping('/admin')
    adminLogin(req: Request, res: Response) {
        this._authService.generateAccessToken(req.body.username, req.body.password, true).then(jwt => {
            if (!jwt) {
                return res.status(401).send('Invalid username or password.');
            }
            res.send(jwt);
        });
    }

    @PostMapping()
    login(req: Request, res: Response) {
        this._authService.generateAccessToken(req.body.username, req.body.password).then(jwt => {
            if (!jwt) {
                return res.status(401).send('Invalid username or password.');
            }
            res.send(jwt);
        });
    }

    @PostMapping('/register')
    register(req: Request, res: Response) {
        this._userService.register(req.body.username, req.body.email, req.body.password).then(
            () => res.send('success'),
            err => res.status(400).send(err)
        );
    }

    requestPasswordReset(req: Request, res: Response) {
        // TODO Implement this
    }

}