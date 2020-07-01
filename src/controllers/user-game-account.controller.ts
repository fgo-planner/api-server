import { Request, Response } from 'express';
import { GetMapping, PostMapping, RestController, UserAccessLevel } from 'internal';
import { UserGameAccountService } from 'services';
import { Inject } from 'typedi';

@RestController('/user/game-account', UserAccessLevel.Authenticated)
export class UserGameAccountController {

    @Inject()
    private _gameAccountService: UserGameAccountService;

    @PostMapping()
    addAccount(req: Request, res: Response) {
        const userId = (req.token as any).id;
        this._gameAccountService.addAccount(userId, req.body).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/current-user')
    getAccountsForCurrentUser(req: Request, res: Response) {
        const userId = (req.token as any)._id;
        this._gameAccountService.findByUserId(userId).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }
    
}