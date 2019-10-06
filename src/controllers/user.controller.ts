import { NextFunction, Request, Response } from 'express';
import { UserService } from '../services/user/user.service';
import { RestController, GetMapping } from '../internal/decorators/rest-controller.decorator';

@RestController('/user')
export class UserController {

    constructor(private _userService: UserService) {

    }

    @GetMapping('/test')
    test(req: Request, res: Response, next: NextFunction) {
        this._userService.test(req.user._id);
        res.send(JSON.stringify(req.user));
    }

}
