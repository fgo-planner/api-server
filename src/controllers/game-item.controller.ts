import { GameItem } from 'data/types';
import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameItemService } from 'services';
import { Inject } from 'typedi';
import { PaginationUtils } from 'utils';

@RestController('/game-item', UserAccessLevel.Public)
export class GameItemController {

    @Inject()
    private _gameItemService: GameItemService;

    @PutMapping(UserAccessLevel.Admin)
    addGameItem(req: Request, res: Response) {
        const item: GameItem = req.body;
        this._gameItemService.create(item).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping(UserAccessLevel.Admin)
    getItems(req: Request, res: Response) {
        this._gameItemService.findAll().then(
            items => res.send(items),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/search')
    searchItems(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameItemService.search(req.query, pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/:id')
    getItem(req: Request, res: Response) {
        this._gameItemService.findById(req.params.id).then(
            item => res.send(item),
            err => res.status(404).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.update(item).then(
            updated => res.send(updated),
            err => res.status(400).send(err)
        );
    }

}
