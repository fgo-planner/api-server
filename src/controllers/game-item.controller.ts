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
    createItem(req: Request, res: Response) {
        const item: GameItem = req.body;
        this._gameItemService.create(item).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping()
    getItems(req: Request, res: Response) {
        this._gameItemService.findAll().then(
            items => res.send(items),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/page')
    getItemsPage(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameItemService.findPage(pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/:id')
    getItem(req: Request, res: Response) {
        const id = Number(req.params.id);
        this._gameItemService.findById(id).then(
            item => {
                if (item) {
                    return res.send(item);
                }
                res.status(404).send(`Item ID ${id} could not be found.`);
            },
            err => res.status(400).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.update(item).then(
            updated => {
                if (updated) {
                    return res.send(updated);
                }
                res.status(404).send(`Item ID ${item._id} does not exist.`);
            },
            err => res.status(400).send(err)
        );
    }

}
