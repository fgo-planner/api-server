import { Request, Response } from 'express';
import { GetMapping, RestController } from 'internal';
import { UserService } from 'services';
import { Inject } from 'typedi';
import { ObjectIdUtils } from 'utils';

@RestController('/user')
export class UserController {

    @Inject()
    private _userService: UserService;

    @GetMapping('/current-user')
    async getCurrentUser(req: Request, res: Response): Promise<any> {
        const userId = ObjectIdUtils.convertToObjectId(req.token.id);
        try {
            const user = await this._userService.findByIdBasic(userId);
            res.send(user);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
