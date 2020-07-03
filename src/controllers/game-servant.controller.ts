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

    getServants(req: Request, res: Response) {
        this._gameServantService.findAll().then(
            servants => res.send(servants),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/page')
    getServantsPage(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameServantService.findPage(pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/:id')
    getServant(req: Request, res: Response) {
        const id = Number(req.params.id);
        this._gameServantService.findById(id).then(
            servant => {
                if (servant) {
                    return res.send(servant);
                }
                res.status(404).send(`Servant ID ${id} could not be found.`);
            },
            err => res.status(400).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateServant(req: Request, res: Response) {
        const servant = req.body;
        this._gameServantService.update(servant).then(
            updated => {
                if (updated) {
                    return res.send(updated);
                }
                res.status(404).send(`Servant ID ${servant._id} does not exist.`);
            },
            err => res.status(400).send(err)
        );
    }

}
