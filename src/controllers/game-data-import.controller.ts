import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { GameDataImportService } from 'services';
import { Inject } from 'typedi';

@RestController('/game-data/import', UserAccessLevel.Admin)
export class GameDataImportController {

    @Inject()
    private _dataImportService: GameDataImportService;

    @PostMapping('/atlas-academy')
    async import(req: Request, res: Response): Promise<any> {
        const options = req.body;
        try {
            const data = await this._dataImportService.importFromAtlasAcademy(options);
            res.send(data);
        } catch (err) {
            res.status(500).send(err);
        }
    }

}
