import { GameServant } from 'data/types';
import { GameDataImportOptions, GameDataImportResult, GameDataImportResultSet } from 'dto';
import { Inject, Service } from 'typedi';
import { GameServantService } from '../../game-servant.service';
import { AtlasAcademyDataImportService } from './atlas-academy/atlas-academy-data-import.service';

@Service()
export class GameDataImportService {

    @Inject()
    private _gameServantService: GameServantService;

    @Inject()
    private _atlasAcademyDataImportService: AtlasAcademyDataImportService;

    async importFromAtlasAcademy(options?: GameDataImportOptions): Promise<GameDataImportResultSet> {
        const servants = await this._atlasAcademyDataImportService.getServants();
        const servantResult = await this._processServants(servants, options);
        return {
            servants: servantResult
        };
    }

    /**
     * Writes the imported servants to the database according to the options.
     * Assumes that there are no conflicts with unique fields such as
     * `collectionNo`.
     */
    private async _processServants(servants: GameServant[], options?: GameDataImportOptions): Promise<GameDataImportResult> {
        let updated = 0, created = 0, errors = 0;
        const log: any[] = [];
        if (options && !options.servants?.import) {
            return { updated, created, errors, log };
        }
        const override = !!options.servants.override;
        for (const servant of servants) {
            try {
                let exists: boolean;
                if (override) {
                    exists = await this._processServantOverride(servant);
                } else {
                    exists = await this._processServantAppend(servant);
                }
                if (exists) {
                    updated++;
                } else {
                    created++;
                }
            } catch (err) {
                log.push(err);
                errors++;
            }
        }
        return { updated, created, errors, log };
    }

    /**
     * Writes the imported servant to the database, overriding existing servant
     * data if it is already in the database. Assumes that there are no conflicts
     * with unique fields such as `collectionNo`.
     */
    private async _processServantOverride(servant: GameServant): Promise<boolean> {
        const exists = await this._gameServantService.existsById(servant._id);
        if (!exists) {
            await this._gameServantService.create(servant);
        } else {
            await this._gameServantService.update(servant);
        }
        return exists;
    }

    /**
     * Writes the imported servant to the database, appending to existing servant
     * data if it is already in the database. Assumes that there are no conflicts
     * with unique fields such as `collectionNo`.
     */
    private async _processServantAppend(servant: GameServant): Promise<boolean> {
        const existing = await this._gameServantService.findById(servant._id);
        if (!existing) {
            await this._gameServantService.create(servant);
        } else {
            // TODO append data to existing copy
            await this._gameServantService.update(existing);
        }
        return !!existing;
    }

}