import { Request, Response } from 'express';
import { GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { GameSoundtrackService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, PaginationUtils } from 'utils';

@RestController('/game-soundtrack', UserAccessLevel.Public)
export class GameSoundtrackController {

    @Inject()
    private _gameSoundtrackService!: GameSoundtrackService;

    // TODO Implement auto expire
    private _gameSoundtracksCachedResponse?: string;

    @PutMapping(UserAccessLevel.Admin)
    async createSoundtrack(req: Request, res: Response): Promise<any> {
        let soundtrack = req.body;
        try {
            soundtrack = await this._gameSoundtrackService.create(soundtrack);
            res.send(soundtrack);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping()
    async getSoundtracks(req: Request, res: Response): Promise<any> {
        try {
            if (req.query.ids) {
                const ids = HttpRequestUtils.parseIntegerList(req.query.ids);
                const soundtracks = await this._gameSoundtrackService.findByIds(ids);
                res.send(soundtracks);
            } else {
                if (!this._gameSoundtracksCachedResponse) {
                    const soundtracks = await this._gameSoundtrackService.findAll();
                    this._gameSoundtracksCachedResponse = JSON.stringify(soundtracks);
                }
                res.setHeader('content-type', 'application/json'); // TODO un-hardcode this
                res.send(this._gameSoundtracksCachedResponse);
            }
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getSoundtracksPage(req: Request, res: Response): Promise<any> {
        try {
            const pagination = PaginationUtils.parse(req.query);
            const page = await this._gameSoundtrackService.findPage(pagination);
            res.send(PaginationUtils.toPage(page.data, page.total, pagination));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getSoundtrack(req: Request, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseNumericalIdFromParams(req.params, 'id');
            const soundtrack = await this._gameSoundtrackService.findById(id);
            if (!soundtrack) {
                return res.status(404).send(`Soundtrack ID ${id} could not be found.`);
            }
            res.send(soundtrack);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping(UserAccessLevel.Admin)
    async updateSoundtrack(req: Request, res: Response): Promise<any> {
        let soundtrack = req.body;
        try {
            soundtrack = await this._gameSoundtrackService.update(soundtrack);
            if (!soundtrack) {
                return res.status(404).send(`Soundtrack ID ${req.body._id} does not exist.`);
            }
            res.send(soundtrack);
        } catch (err) {
            res.status(400).send(err);
        }
    }

}
