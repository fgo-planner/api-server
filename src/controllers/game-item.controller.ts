import { Request, Response } from 'express';
import { GameItem } from 'game/object/game-item.type';
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
    addGameItem(req: Request, res: Response) {
        const item: GameItem = req.body;
        this._gameItemService.createGameItem(item).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/:id')
    getGameItem(req: Request, res: Response) {
        this._gameItemService.findGameItemById(req.params.id).then(
            item => res.send(item),
            err => res.status(404).send(err)
        );
    }

    @GetMapping()
    @Secured(RouteSecurityLevel.ADMIN)
    getGameItems(req: Request, res: Response) {
        this._gameItemService.getGameItems().then(
            items => res.send(items),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/search')
    searchGameItems(req: Request, res: Response) {
        this._gameItemService.searchGameItems({}).then(
            items => res.send(items),
            err => res.status(404).send(err)
        );
    }

    @PostMapping()
    @Secured(RouteSecurityLevel.ADMIN)
    updateGameItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.updateGameItem(item).then(
            updated => res.send(updated),
            err => res.status(400).send(err)
        );
    }

}
