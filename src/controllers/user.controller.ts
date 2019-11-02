import { Request, Response } from 'express';
import { GetMapping, RestController } from 'internal';
import { UserService } from 'services';
import { Inject } from 'typedi';

@RestController('/user')
export class UserController {

    @Inject()
    private _userService: UserService;

    @GetMapping('/test/:status')
    test(req: Request, res: Response) {
        this._userService.test(req.token.id, req.params['status'] === 'true');
        res.send(JSON.stringify(req.token));
    }

}
