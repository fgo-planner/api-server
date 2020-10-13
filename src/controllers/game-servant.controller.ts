import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameServantService } from 'services';
import { Inject } from 'typedi';
import { PaginationUtils, HttpRequestUtils } from 'utils';

@RestController('/game-servant', UserAccessLevel.Public)
export class GameServantController {

    @Inject()
    private _gameServantService: GameServantService;

    @PutMapping(UserAccessLevel.Admin)
    async createServant(req: Request, res: Response): Promise<any> {
        let servant = req.body;
        try {
            servant = await this._gameServantService.create(servant);
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping()
    async getServants(req: Request, res: Response): Promise<any> {
        try {
            let servants;
            if (req.query.ids) {
                const ids = HttpRequestUtils.parseIntegerList(req.query.ids);
                servants = await this._gameServantService.findByIds(ids);
            } else {
                servants = await this._gameServantService.findAll();
            }
            res.send(servants);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getServantsPage(req: Request, res: Response): Promise<any> {
        try {
            const pagination = PaginationUtils.parse(req.query);
            const page = await this._gameServantService.findPage(pagination);
            res.send(PaginationUtils.toPage(page.data, page.total, pagination));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getServant(req: Request, res: Response): Promise<any> {
        const id = Number(req.params.id);
        try {
            const servant = await this._gameServantService.findById(id);
            if (!servant) {
                return res.status(404).send(`Servant ID ${id} could not be found.`);
            }
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping(UserAccessLevel.Admin)
    async updateServant(req: Request, res: Response): Promise<any> {
        let servant = req.body;
        try {
            servant = await this._gameServantService.update(servant);
            if (!servant) {
                return res.status(404).send(`Servant ID ${req.body._id} does not exist.`);
            }
            res.send(servant);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
