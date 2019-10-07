import { Request, Response } from 'express';
import { GetMapping, RestController, PostMapping } from '../internal/decorators/rest-controller.decorator';
import { GameItemService } from '../services/game/object/game-item.service';

@RestController('/game-item')
export class GameItemController {

    constructor(private _gameItemService: GameItemService) {

    }

    // TODO Make this admin only
    @PostMapping()
    addItem(req: Request, res: Response) {
        const item = req.body;
        this._gameItemService.addItem(item).then(
            item => res.send(item.toJSON()),
            err => res.status(400).send(err)
        );
    }

    @GetMapping()
    getItems(req: Request, res: Response) {
        this._gameItemService.getItems().then(
            items => res.send(items),
            err => res.status(404).send(err)
        );
    }

}
