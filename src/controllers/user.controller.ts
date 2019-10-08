import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { GetMapping, RestController } from '../internal/decorators/rest-controller.decorator';
import { UserService } from '../services/user/user.service';

@RestController('/user')
export class UserController {

    @Inject()
    private _userService: UserService;

    @GetMapping('/test')
    test(req: Request, res: Response, next: NextFunction) {
        this._userService.test(req.user._id);
        res.send(JSON.stringify(req.user));
    }

}
