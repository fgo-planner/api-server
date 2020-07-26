import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameEventService } from 'services';
import { Inject } from 'typedi';
import { ObjectIdUtils, PaginationUtils } from 'utils';

@RestController('/game-event', UserAccessLevel.Public)
export class GameEventController {

    @Inject()
    private _gameEventService: GameEventService;

    @PutMapping(UserAccessLevel.Admin)
    async createEvent(req: Request, res: Response): Promise<any> {
        let event = req.body;
        try {
            event = await this._gameEventService.create(event);
            res.send(event);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping()
    async getEvents(req: Request, res: Response): Promise<any> {
        try {
            const events = await this._gameEventService.findAll();
            res.send(events);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getEventsPage(req: Request, res: Response): Promise<any> {
        try {
            const pagination = PaginationUtils.parse(req.query);
            const page = await this._gameEventService.findPage(pagination);
            res.send(PaginationUtils.toPage(page.data, page.total, pagination));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getEvent(req: Request, res: Response): Promise<any> {
        const id = ObjectIdUtils.convertToObjectId(req.params.id);
        try {
            const event = await this._gameEventService.findById(id);
            if (!event) {
                return res.status(404).send(`Event ID ${id} could not be found.`);
            }
            res.send(event);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping(UserAccessLevel.Admin)
    async updateEvent(req: Request, res: Response): Promise<any> {
        let event = req.body;
        try {
            event = await this._gameEventService.update(event);
            if (!event) {
                return res.status(404).send(`Event ID ${req.body._id} does not exist.`);
            }
            res.send(event);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
