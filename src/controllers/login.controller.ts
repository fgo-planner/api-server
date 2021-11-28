import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { AuthenticationService } from 'services';
import { Inject } from 'typedi';

@RestController('/login', UserAccessLevel.Public)
export class LoginController {

    @Inject()
    private _authService!: AuthenticationService;

    @PostMapping('/admin')
    adminLogin(req: Request, res: Response): void {
        this._login(req, res, true);
    }

    @PostMapping()
    login(req: Request, res: Response): void {
        this._login(req, res, false);
    }

    private async _login(req: Request, res: Response, admin: boolean): Promise<any> {
        const { username, password } = req.body;
        // TODO Determine whether the secure token should be generated.
        const tokens = await this._authService.generateAccessToken({ username, password }, true, admin);
        if (!tokens) {
            return res.status(401).send('Invalid username or password.');
        }
        res.cookie(AuthenticationService.AccessTokenCookieName, tokens.redundantToken, {
            httpOnly: true
            // TODO Add secure and sameSite flags
        }).send(tokens.token);
    }

}
