import { GameCraftEssence } from 'data/types';
import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameCraftEssenceService } from 'services';
import { Inject } from 'typedi';
import { PaginationUtils } from 'utils';

@RestController('/game-craft-essence', UserAccessLevel.Public)
export class GameCraftEssenceController {

    @Inject()
    private _gameCraftEssenceService: GameCraftEssenceService;

    @PutMapping(UserAccessLevel.Admin)
    addGameCraftEssence(req: Request, res: Response) {
        const craftEssence: GameCraftEssence = req.body;
        this._gameCraftEssenceService.create(craftEssence).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping(UserAccessLevel.Admin)
    getCraftEssences(req: Request, res: Response) {
        this._gameCraftEssenceService.findAll().then(
            craftEssences => res.send(craftEssences),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/search')
    searchCraftEssences(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameCraftEssenceService.search(req.query, pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/:id')
    getCraftEssence(req: Request, res: Response) {
        this._gameCraftEssenceService.findById(req.params.id).then(
            craftEssence => res.send(craftEssence),
            err => res.status(404).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateCraftEssence(req: Request, res: Response) {
        const craftEssence = req.body;
        this._gameCraftEssenceService.update(craftEssence).then(
            updated => res.send(updated),
            err => res.status(400).send(err)
        );
    }

}