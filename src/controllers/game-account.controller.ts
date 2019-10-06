import { NextFunction, Request, Response } from 'express';
import { RestController, PostMapping, GetMapping } from '../internal/decorators/rest-controller.decorator';
import { GameAccountService } from '../services/game/game-account.service';

@RestController('/game-account')
export class GameAccountController {

    constructor(private _gameAccountService: GameAccountService) {

    }

    @PostMapping()
    addAccount(req: Request, res: Response, next: NextFunction) {
        const userId = (req.user as any)._id;
        this._gameAccountService.addAccount(userId, req.body).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/current-user')
    getAccountsForCurrentUser(req: Request, res: Response, next: NextFunction) {
        const userId = (req.user as any)._id;
        this._gameAccountService.findByUserId(userId).then(
            value => res.send(value),
            err => res.status(400).send(err)
        );
    }
    
}