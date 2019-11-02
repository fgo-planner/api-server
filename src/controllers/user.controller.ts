import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { GetMapping, RestController } from '../internal';
import { UserService } from '../services/user/user.service';

@RestController('/user')
export class UserController {

    @Inject()
    private _userService: UserService;

    @GetMapping('/test/:status')
    test(req: Request, res: Response, next: NextFunction) {
        this._userService.test(req.token.id, req.params['status'] === 'true');
        res.send(JSON.stringify(req.token));
    }

}
