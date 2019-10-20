import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { GetMapping, RestController, Secured } from '../internal/decorators/rest-controller.decorator';
import { RouteSecurityLevel } from '../internal/types/route-security-level.enum';
import { UserService } from '../services/user/user.service';

@RestController('/user')
export class UserController {

    @Inject()
    private _userService: UserService;

    @GetMapping('/test/:status')
    @Secured(RouteSecurityLevel.ADMIN)
    test(req: Request, res: Response, next: NextFunction) {
        this._userService.test(req.token.id, req.params['status'] === 'true');
        res.send(JSON.stringify(req.token));
    }

}
