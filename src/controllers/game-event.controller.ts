import { GameEvent } from 'data/types';
import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameEventService } from 'services';
import { Inject } from 'typedi';
import { PaginationUtils } from 'utils';

@RestController('/game-event', UserAccessLevel.Public)
export class GameEventController {

    @Inject()
    private _gameEventService: GameEventService;

    @PutMapping(UserAccessLevel.Admin)
    createEvent(req: Request, res: Response) {
        const event: GameEvent = req.body;
        this._gameEventService.create(event).then(
            created => res.send(created),
            err => res.status(400).send(err)
        );
    }

    @GetMapping()
    getEvents(req: Request, res: Response) {
        this._gameEventService.findAll().then(
            events => res.send(events),
            err => res.status(400).send(err)
        );
    }

    @GetMapping('/page')
    getEventsPage(req: Request, res: Response) {
        const pagination = PaginationUtils.parse(req.query);
        this._gameEventService.findPage(pagination).then(
            data => res.send(PaginationUtils.toPage(data.data, data.total, pagination)),
            err => res.status(404).send(err)
        );
    }

    @GetMapping('/:id')
    getEvent(req: Request, res: Response) {
        const id = Number(req.params.id);
        this._gameEventService.findById(id).then(
            event => {
                if (event) {
                    return res.send(event);
                }
                res.status(404).send(`Event ID ${id} could not be found.`);
            },
            err => res.status(400).send(err)
        );
    }

    @PostMapping(UserAccessLevel.Admin)
    updateEvent(req: Request, res: Response) {
        const event = req.body;
        this._gameEventService.update(event).then(
            updated => {
                if (updated) {
                    return res.send(updated);
                }
                res.status(404).send(`Event ID ${event._id} does not exist.`);
            },
            err => res.status(400).send(err)
        );
    }

}
