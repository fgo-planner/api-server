import { Request, Response } from 'express';
import { CachedResponse, GetMapping, InvalidateCachedResponse, PostMapping, PutMapping, ResponseCacheKey, RestController, UserAccessLevel } from 'internal';
import { GameSoundtrackService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, PaginationUtils } from 'utils';

@RestController('/game-soundtrack', UserAccessLevel.Public)
export class GameSoundtrackController {

    @Inject()
    private _gameSoundtrackService!: GameSoundtrackService;

    @PutMapping(UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameSoundtrack, [200])
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
    @CachedResponse(ResponseCacheKey.GameSoundtrack)
    async getSoundtracks(req: Request, res: Response): Promise<any> {
        try {
            const soundtracks = await this._gameSoundtrackService.findAll();
            res.send(soundtracks);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/page')
    async getSoundtracksPage(req: Request, res: Response): Promise<any> {
        try {
            const pagination = PaginationUtils.parse(req.query);
            const page = await this._gameSoundtrackService.findPage(pagination);
            res.send(page);
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
    @InvalidateCachedResponse(ResponseCacheKey.GameSoundtrack, [200])
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

    @PostMapping('/invalidate-cache', UserAccessLevel.Admin)
    @InvalidateCachedResponse(ResponseCacheKey.GameSoundtrack)
    invalidateCache(_: Request, res: Response): void {
        res.send();
    }

}
