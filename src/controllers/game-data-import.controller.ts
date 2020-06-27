import { GameDataImportOptions } from 'dto';
import { Request, Response } from 'express';
import { PostMapping, RestController, UserAccessLevel } from 'internal';
import { GameDataImportService } from 'services';
import { Inject } from 'typedi';

@RestController('/game-data/import', UserAccessLevel.Admin)
export class GameDataImportController {

    @Inject()
    private _dataImportService: GameDataImportService;

    @PostMapping('/atlas-academy')
    import(req: Request, res: Response) {
        const options: GameDataImportOptions = req.body;
        this._dataImportService.importFromAtlasAcademy(options).then(
            data => res.send(data),
            err => res.status(500).send(err)
        );
    }

}
