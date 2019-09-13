import { NextFunction, Request, Response } from 'express';
import { Service } from 'typedi';
import { UserService } from '../../services/user/user.service';

@Service()
export class UserController {

    constructor(private _userService: UserService) {

    }

    test(req: Request, res: Response, next: NextFunction) {
        this._userService.test(req.user._id);
        res.send(JSON.stringify(req.user));
    }

}
