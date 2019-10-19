import { Request, Response } from 'express';
import { Inject } from 'typedi';
import { RouteSecurityLevel } from '../internal';
import { GetMapping, PostMapping, PutMapping, RestController, Secured } from '../internal/';
import { GameItemService } from '../services/game/object/game-item.service';

@RestController('/game-item')
export class GameItemController {

    @Inject()
    private _gameItemService: GameItemService;

    @PutMapping()
    @Secured(RouteSecurityLevel.ADMIN)
    createGameItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.createItem(item).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping()
    @Secured(RouteSecurityLevel.ADMIN)
    findGameItems(req: Request, res: Response) {
        this._gameItemService.findItems().then(
            items => res.send(items),
            err => res.status(404).send(err)
        );
    }

    @PostMapping()
    @Secured(RouteSecurityLevel.ADMIN)
    updateGameItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.updateItem(item).then(
            updated => res.send(updated),
            err => res.status(400).send(err)
        );
    }

}
