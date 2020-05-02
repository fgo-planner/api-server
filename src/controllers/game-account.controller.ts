import { Request, Response } from 'express';
import { GetMapping, PostMapping, RestController, UserAccessLevel } from 'internal';
import { GameAccountService } from 'services';
import { Inject } from 'typedi';

@RestController('/game-account', UserAccessLevel.Authenticated)
export class GameAccountController {

    @Inject()
    private _gameAccountService: GameAccountService;

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