import { GameServant } from 'data/types';
import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameServantService } from 'services';
import { Inject } from 'typedi';
import { PaginationUtils } from 'utils';

@RestController('/game-servant', UserAccessLevel.Public)
export class GameServantController {

    @Inject()
    private _gameServantService: GameServantService;

    @PutMapping(UserAccessLevel.Admin)
    createServant(req: Request, res: Response) {
        const servant: GameServant = req.body;
        this._gameServantService.create(servant).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping(UserAccessLevel.Admin)
    getServants(req: Request, res: Response) {
        this._gameServantService.findAll().then(
            servants => res.send(servants),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/search')
    searchServants(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameServantService.search(req.query, pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/:id')
    getServant(req: Request, res: Response) {
        this._gameServantService.findById(req.params.id).then(
            servant => res.send(servant),
            err => res.status(404).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateServant(req: Request, res: Response) {
        const servant = req.body;
        this._gameServantService.update(servant).then(
            updated => res.send(updated),
            err => res.status(400).send(err)
        );
    }

}