import { Request, Response } from 'express';
import { CachedResponse, GetMapping, InvalidateCachedResponse, PostMapping, PutMapping, ResponseCacheKey, RestController, UserAccessLevel } from 'internal';
import { GameItemService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, PaginationUtils } from 'utils';

@RestController('/game-item', UserAccessLevel.Public)
export class GameItemController {

    @Inject()
    private _gameItemService!: GameItemService;

    @PutMapping(UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameItem, [200])
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
    async getItems(_: Request, res: Response): Promise<any> {
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
    @InvalidateCachedResponse(ResponseCacheKey.GameItem, [200])
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

    @PostMapping('/invalidate-cache', UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameItem)
    invalidateCache(_: Request, res: Response): void {
        res.send();
    }

}
