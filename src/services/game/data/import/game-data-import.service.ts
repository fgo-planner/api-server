import { GameItem, GameServant, GameSoundtrack } from '@fgo-planner/data';
import { GameDataImportExistingAction, GameDataImportOptions, GameDataImportResult, GameDataImportResultSet } from 'dto';
import { Logger, ResponseCacheKey, ResponseCacheManager } from 'internal';
import { Inject, Service } from 'typedi';
import { GameItemService } from '../../game-item.service';
import { GameServantService } from '../../game-servant.service';
import { GameSoundtrackService } from '../../game-soundtrack.service';
import { AtlasAcademyDataImportService } from './atlas-academy/atlas-academy-data-import.service';

@Service()
export class GameDataImportService {

    @Inject()
    private _responseCacheManager!: ResponseCacheManager;

    @Inject()
    private _gameItemService!: GameItemService;

    @Inject()
    private _gameServantService!: GameServantService;

    @Inject()
    private _gameSoundtrackService!: GameSoundtrackService;

    @Inject()
    private _atlasAcademyDataImportService!: AtlasAcademyDataImportService;

    async importFromAtlasAcademy(options: GameDataImportOptions): Promise<GameDataImportResultSet> {
        const resultSet: GameDataImportResultSet = {};
        // TODO Ensure entities are sorted before writing to database.
        if (options.servants?.import) {
            const logger: Logger = new Logger();
            logger.setStart();
            const existingAction = options.servants.onExisting || GameDataImportExistingAction.Skip;
            const skipIds = await this._getServantIdsToSkip(existingAction);
            const servants = await this._atlasAcademyDataImportService.getServants(skipIds, logger);
            const result = await this._processServants(servants, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.servants = result;
        }
        if (options.items?.import) {
            const logger: Logger = new Logger();
            logger.setStart();
            const existingAction = options.items.onExisting || GameDataImportExistingAction.Skip;
            const skipIdSet = await this._getItemsIdsToSkip(existingAction);
            const items = await this._atlasAcademyDataImportService.getItems(skipIdSet, logger);
            const result = await this._processItems(items, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.items = result;
        }
        if (options.soundtracks?.import) {
            const logger: Logger = new Logger();
            logger.setStart();
            const existingAction = options.soundtracks.onExisting || GameDataImportExistingAction.Skip;
            const skipIdSet = await this._getSoundtrackIdsToSkip(existingAction);
            const soundtracks = await this._atlasAcademyDataImportService.getSoundtracks(skipIdSet, logger);
            const result = await this._processSoundtracks(soundtracks, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.soundtracks = result;
        }
        return resultSet;
    }

    //#region Servant methods

    /**
     * Generates a set of servant IDs that should be skipped based on the provided
     * `GameDataImportExistingAction` option. For the `Override` and `Append`
     * options, this method will return an empty set. For the `Skip` options, this
     * method will return the set of unique servant IDs that are current on the
     * database.
     */
    private async _getServantIdsToSkip(existingAction: GameDataImportExistingAction): Promise<Set<number>> {
        const result = new Set<number>();
        if (existingAction !== GameDataImportExistingAction.Skip) {
            return result;
        }
        const ids = await this._gameServantService.findAllIds();
        for (const id of ids) {
            result.add(id);
        }
        return result;
    }

    /**
     * Writes the imported servants to the database according to the options.
     * Assumes that there are no conflicts with unique fields such as
     * `collectionNo`.
     */
    private async _processServants(
        servants: GameServant[],
        existingAction: GameDataImportExistingAction,
        logger: Logger
    ): Promise<GameDataImportResult> {

        let updated = 0, created = 0, errors = 0;
        for (const servant of servants) {
            logger.info(`Processing servant collectionNo=${servant.collectionNo}.`);
            try {
                let exists: boolean;
                if (existingAction === GameDataImportExistingAction.Override) {
                    exists = await this._processServantOverride(servant);
                } else if (existingAction === GameDataImportExistingAction.Append) {
                    exists = await this._processServantAppend(servant);
                } else {
                    exists = await this._processServantSkip(servant);
                    if (exists) {
                        logger.info(`Servant (collectionNo=${servant.collectionNo}) was skipped.`);
                        continue;
                    }
                }
                if (exists) {
                    logger.info(`Servant (collectionNo=${servant.collectionNo}) was updated.`);
                    updated++;
                } else {
                    logger.info(`Servant (collectionNo=${servant.collectionNo}) was created.`);
                    created++;
                }
            } catch (err) {
                logger.error(err);
                errors++;
            }
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameServant);
        }
        return { updated, created, errors };
    }

    /**
     * Writes the imported servant to the database if it does not already exist in
     * the database.
     */
    private async _processServantSkip(servant: GameServant): Promise<boolean> {
        const exists = await this._gameServantService.existsById(servant._id);
        if (!exists) {
            await this._gameServantService.create(servant);
        }
        return exists;
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

    //#endregion


    //#region Item methods

    /**
     * Generates a set of item IDs that should be skipped based on the provided
     * `GameDataImportExistingAction` option. For the `Override` and `Append`
     * options, this method will return an empty set. For the `Skip` options, this
     * method will return the set of unique item IDs that are current on the
     * database.
     */
    private async _getItemsIdsToSkip(existingAction: GameDataImportExistingAction): Promise<Set<number>> {
        const result = new Set<number>();
        if (existingAction !== GameDataImportExistingAction.Skip) {
            return result;
        }
        const ids = await this._gameItemService.findAllIds();
        for (const id of ids) {
            result.add(id);
        }
        return result;
    }

    /**
     * Writes the imported items to the database according to the options.
     */
    private async _processItems(
        items: GameItem[],
        existingAction: GameDataImportExistingAction,
        logger: Logger
    ): Promise<GameDataImportResult> {

        let updated = 0, created = 0, errors = 0;
        for (const item of items) {
            logger.info(`Processing item id=${item._id}.`);
            try {
                let exists: boolean;
                if (existingAction === GameDataImportExistingAction.Override) {
                    exists = await this._processItemOverride(item);
                } else if (existingAction === GameDataImportExistingAction.Append) {
                    exists = await this._processItemAppend(item);
                } else {
                    exists = await this._processItemSkip(item);
                    if (exists) {
                        logger.info(`Item (id=${item._id}) was skipped.`);
                        continue;
                    }
                }
                if (exists) {
                    logger.info(`Item (id=${item._id}) was updated.`);
                    updated++;
                } else {
                    logger.info(`Item (id=${item._id}) was created.`);
                    created++;
                }
            } catch (err) {
                logger.error(err);
                errors++;
            }
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameItem);
        }
        return { updated, created, errors };
    }

    /**
     * Writes the imported item to the database if it does not already exist in the
     * database.
     */
    private async _processItemSkip(item: GameItem): Promise<boolean> {
        const exists = await this._gameItemService.existsById(item._id);
        if (!exists) {
            await this._gameItemService.create(item);
        }
        return exists;
    }

    /**
     * Writes the imported item to the database, overriding existing item data if
     * it is already in the database.
     */
    private async _processItemOverride(item: GameItem): Promise<boolean> {
        const exists = await this._gameItemService.existsById(item._id);
        if (!exists) {
            await this._gameItemService.create(item);
        } else {
            await this._gameItemService.update(item);
        }
        return exists;
    }

    /**
     * Writes the imported item to the database, appending to existing item data if
     * it is already in the database.
     */
    private async _processItemAppend(item: GameItem): Promise<boolean> {
        const existing = await this._gameItemService.findById(item._id);
        if (!existing) {
            await this._gameItemService.create(item);
        } else {
            existing.uses = item.uses; // TODO Push instead of replace
            await this._gameItemService.update(existing);
        }
        return !!existing;
    }

    //#endregion


    //#region Item methods

    /**
     * Generates a set of soundtrack IDs that should be skipped based on the
     * provided `GameDataImportExistingAction` option. For the `Override` and
     * `Append` options, this method will return an empty set. For the `Skip`
     * options, this method will return the set of unique item IDs that are current
     * on the database.
     */
    private async _getSoundtrackIdsToSkip(existingAction: GameDataImportExistingAction): Promise<Set<number>> {
        const result = new Set<number>();
        if (existingAction !== GameDataImportExistingAction.Skip) {
            return result;
        }
        const ids = await this._gameSoundtrackService.findAllIds();
        for (const id of ids) {
            result.add(id);
        }
        return result;
    }

    /**
     * Writes the imported soundtrack to the database according to the options.
     */
    private async _processSoundtracks(
        soundtracks: GameSoundtrack[],
        existingAction: GameDataImportExistingAction,
        logger: Logger
    ): Promise<GameDataImportResult> {

        let updated = 0, created = 0, errors = 0;
        for (const soundtrack of soundtracks) {
            logger.info(`Processing soundtrack id=${soundtrack._id}.`);
            try {
                let exists: boolean;
                if (existingAction === GameDataImportExistingAction.Override) {
                    exists = await this._processSoundtrackOverride(soundtrack);
                } else if (existingAction === GameDataImportExistingAction.Append) {
                    exists = await this._processSoundtrackAppend(soundtrack);
                } else {
                    exists = await this._processSoundtrackSkip(soundtrack);
                    if (exists) {
                        logger.info(`Soundtrack (id=${soundtrack._id}) was skipped.`);
                        continue;
                    }
                }
                if (exists) {
                    logger.info(`Soundtrack (id=${soundtrack._id}) was updated.`);
                    updated++;
                } else {
                    logger.info(`Soundtrack (id=${soundtrack._id}) was created.`);
                    created++;
                }
            } catch (err) {
                logger.error(err);
                errors++;
            }
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameSoundtrack);
        }
        return { updated, created, errors };
    }

    /**
     * Writes the imported soundtrack to the database if it does not already exist in the
     * database.
     */
    private async _processSoundtrackSkip(soundtrack: GameSoundtrack): Promise<boolean> {
        const exists = await this._gameSoundtrackService.existsById(soundtrack._id);
        if (!exists) {
            await this._gameSoundtrackService.create(soundtrack);
        }
        return exists;
    }

    /**
     * Writes the imported soundtrack to the database, overriding existing
     * soundtrack data if it is already in the database.
     */
    private async _processSoundtrackOverride(soundtrack: GameSoundtrack): Promise<boolean> {
        const exists = await this._gameSoundtrackService.existsById(soundtrack._id);
        if (!exists) {
            await this._gameSoundtrackService.create(soundtrack);
        } else {
            await this._gameSoundtrackService.update(soundtrack);
        }
        return exists;
    }

    /**
     * Writes the imported soundtrack to the database, appending to existing
     * soundtrack data if it is already in the database.
     */
    private async _processSoundtrackAppend(soundtrack: GameSoundtrack): Promise<boolean> {
        const existing = await this._gameSoundtrackService.findById(soundtrack._id);
        if (!existing) {
            await this._gameSoundtrackService.create(soundtrack);
        } else {
            await this._gameSoundtrackService.update(existing);
        }
        return !!existing;
    }

    //#endregion

}