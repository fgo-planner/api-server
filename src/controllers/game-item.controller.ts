import { Request, Response } from 'express';
import { CachedResponse, GetMapping, PostMapping, PutMapping, ResponseCacheKey, RestController, UserAccessLevel } from 'internal';
import { GameItemService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, PaginationUtils } from 'utils';

@RestController('/game-item', UserAccessLevel.Public)
export class GameItemController {

    @Inject()
    private _gameItemService!: GameItemService;

    @PutMapping(UserAccessLevel.Admin)
    async createItem(req: Request, res: Response): Promise<any> {
        let item = req.body;
        try {
            item = await this._gameItemService.create(item);
            res.send(item);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping()
    @CachedResponse(ResponseCacheKey.GameItem)
    async getItems(req: Request, res: Response): Promise<any> {
        try {
            const items = await this._gameItemService.findAll();
            res.send(items);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getItemsPage(req: Request, res: Response): Promise<any> {
        try {
            const pagination = PaginationUtils.parse(req.query);
            const page = await this._gameItemService.findPage(pagination);
            res.send(PaginationUtils.toPage(page.data, page.total, pagination));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getItem(req: Request, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseNumericalIdFromParams(req.params, 'id');
            const item = await this._gameItemService.findById(id);
            if (!item) {
                return res.status(404).send(`Item ID ${id} could not be found.`);
            }
            res.send(item);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping(UserAccessLevel.Admin)
    async updateItem(req: Request, res: Response): Promise<any> {
        let item = req.body;
        try {
            item = await this._gameItemService.update(item);
            if (!item) {
                return res.status(404).send(`Item ID ${req.body._id} does not exist.`);
            }
            res.send(item);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
