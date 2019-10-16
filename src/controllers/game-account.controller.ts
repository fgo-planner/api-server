import { NextFunction, Request, Response } from 'express';
import { Inject } from 'typedi';
import { GetMapping, PostMapping, RestController } from '../internal/decorators/rest-controller.decorator';
import { GameAccountService } from '../services/game/game-account.service';

@RestController('/game-account')
export class GameAccountController {

    @Inject()
    private _gameAccountService: GameAccountService;

    @PostMapping()
    addAccount(req: Request, res: Response, next: NextFunction) {
        const userId = (req.token as any)._id;
        this._gameAccountService.addAccount(userId, req.body).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/current-user')
    getAccountsForCurrentUser(req: Request, res: Response, next: NextFunction) {
        const userId = (req.token as any)._id;
        this._gameAccountService.findByUserId(userId).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }
    
}