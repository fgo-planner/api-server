import { Request, Response } from 'express';
import { AuthenticatedRequest, GetMapping, PostMapping, RestController, UserAccessLevel } from 'internal';
import { UserService } from 'services';
import { Inject } from 'typedi';
import { ObjectIdUtils } from 'utils';

@RestController('/user', UserAccessLevel.Public)
export class UserController {

    @Inject()
    private _userService!: UserService;

        
    @PostMapping('/register')
    async register(req: Request, res: Response): Promise<any> {
        try {
            const { username, password, email, friendId } = req.body;
            await this._userService.register(username, password, email, friendId);
            res.send('success');
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/request-password-reset')
    async requestPasswordReset(req: Request, res: Response): Promise<any> {
        // TODO Implement this
        res.status(501).send('This is not implemented yet.');
    }

    @GetMapping('/current-user', UserAccessLevel.Authenticated)
    async getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<any> {
        const userId = ObjectIdUtils.instantiate(req.token.id);
        try {
            const user = await this._userService.findByIdBasic(userId);
            res.send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
