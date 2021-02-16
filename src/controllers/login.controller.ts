import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { AuthenticationService, UserService } from 'services';
import { Inject } from 'typedi';

@RestController('/login', UserAccessLevel.Public)
export class LoginController {

    @Inject()
    private _authService!: AuthenticationService;

    @Inject()
    private _userService!: UserService;

    @PostMapping('/admin')
    async adminLogin(req: Request, res: Response): Promise<any> {
        const { username, password } = req.body;
        const jwt = await this._authService.generateAccessToken(username, password, true);
        if (!jwt) {
            return res.status(401).send('Invalid username or password.');
        }
        res.send(jwt);
    }

    @PostMapping()
    async login(req: Request, res: Response): Promise<any> {
        const { username, password } = req.body;
        const jwt = await this._authService.generateAccessToken(username, password);
        if (!jwt) {
            return res.status(401).send('Invalid username or password.');
        }
        res.send(jwt);
    }

}
