import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { AuthenticationService } from 'services';
import { Inject } from 'typedi';

@RestController('/auth', UserAccessLevel.Public)
export class AuthenticationController {

    @Inject()
    private _authService!: AuthenticationService;

    @PostMapping('/login/admin')
    adminLogin(req: Request, res: Response): void {
        this._login(req, res, true);
    }

    @PostMapping('/login')
    login(req: Request, res: Response): void {
        this._login(req, res, false);
    }

    @PostMapping('/logout')
    logout(req: Request, res: Response): void {
        if (req.cookies[AuthenticationService.AccessTokenCookieName]) {
            res.clearCookie(AuthenticationService.AccessTokenCookieName);
        }
        res.sendStatus(200);
    }

    private async _login(req: Request, res: Response, admin: boolean): Promise<any> {
        const {
            username,
            password,
            useCookieToken
        } = req.body;

        const tokens = await this._authService.generateAccessToken({ username, password }, useCookieToken, admin);
        if (!tokens) {
            return res.status(401).send('Invalid username or password.');
        }

        if (useCookieToken) {
            res.cookie(AuthenticationService.AccessTokenCookieName, tokens.redundantToken, {
                httpOnly: true,
                secure: true,
                sameSite: 'none'
            });
        }

        res.send(tokens.token);
    }

}
