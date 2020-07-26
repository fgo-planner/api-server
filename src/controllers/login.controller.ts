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
    async adminLogin(req: Request, res: Response): Promise<any> {
        const jwt = await this._authService.generateAccessToken(req.body.username, req.body.password, true);
        if (!jwt) {
            return res.status(401).send('Invalid username or password.');
        }
        res.send(jwt);
    }

    @PostMapping()
    async login(req: Request, res: Response): Promise<any> {
        const jwt = await this._authService.generateAccessToken(req.body.username, req.body.password);
        if (!jwt) {
            return res.status(401).send('Invalid username or password.');
        }
        res.send(jwt);
    }

    @PostMapping('/register')
    async register(req: Request, res: Response): Promise<any> {
        try {
            await this._userService.register(req.body.username, req.body.email, req.body.password);
            res.send('success');
        } catch (err) {
            res.status(400).send(err);
        }
    }

    async requestPasswordReset(req: Request, res: Response): Promise<any> {
        // TODO Implement this
    }

}