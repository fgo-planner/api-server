import { GameItem, GameItemModel, GameServantMetadata, GameServantModel, GameServantWithMetadata, GameSoundtrack, GameSoundtrackModel } from '@fgo-planner/data-mongo';
import { TransformLogger } from '@fgo-planner/transform-core';
import { GameDataImportExistingAction, GameDataImportOptions, GameDataImportResult, GameDataImportResultSet } from 'dto';
import { ResponseCacheKey, ResponseCacheManager } from 'internal';
import { AnyBulkWriteOperation } from 'mongodb';
import { Inject, Service } from 'typedi';
import { GameItemService } from '../../game-item.service';
import { GameServantService } from '../../game-servant.service';
import { GameSoundtrackService } from '../../game-soundtrack.service';
import { AtlasAcademyDataImportService } from './atlas-academy/atlas-academy-data-import.service';

type GameServantBulkWriteQuery = AnyBulkWriteOperation<GameServantWithMetadata>;
type GameItemBulkWriteQuery = AnyBulkWriteOperation<GameItem>;
type GameSoundtrackBulkWriteQuery = AnyBulkWriteOperation<GameSoundtrack>;

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
            const logger: TransformLogger = new TransformLogger();
            logger.setStart();
            const existingAction = options.servants.onExisting || GameDataImportExistingAction.Skip;
            const servants = await this._atlasAcademyDataImportService.getServants(logger);
            const result = await this._writeServants(servants, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.servants = result;
        }
        if (options.items?.import) {
            const logger: TransformLogger = new TransformLogger();
            logger.setStart();
            const existingAction = options.items.onExisting || GameDataImportExistingAction.Skip;
            const items = await this._atlasAcademyDataImportService.getItems(logger);
            const result = await this._writeItems(items, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.items = result;
        }
        if (options.soundtracks?.import) {
            const logger: TransformLogger = new TransformLogger();
            logger.setStart();
            const existingAction = options.soundtracks.onExisting || GameDataImportExistingAction.Skip;
            const soundtracks = await this._atlasAcademyDataImportService.getSoundtracks(logger);
            const result = await this._writeSoundtracks(soundtracks, existingAction, logger);
            logger.setEnd();
            result.logs = logger;
            resultSet.soundtracks = result;
        }
        return resultSet;
    }

    //#region Servant methods

    /**
     * Writes the imported servants to the database according to the options.
     * Assumes that there are no conflicts with unique fields such as
     * `collectionNo`.
     */
    private async _writeServants(
        servants: Array<GameServantWithMetadata>,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameDataImportResult> {
        /**
         * The queries for the bulk write operation.
         */
        const writeQueries: Array<GameServantBulkWriteQuery> = [];
        /**
         * Create a bulk write query for each servant an adds it to the query array.
         */
        for (const servant of servants) {
            const writeQuery = await this._createServantWriteQuery(servant, existingAction, logger);
            if (writeQuery === null) {
                continue;
            }
            writeQueries.push(writeQuery);
        }
        let updated: number, created: number, errors: number;
        try {
            // TODO Move this to service layer
            const writeResult = await GameServantModel.bulkWrite(writeQueries, { ordered: false });
            updated = writeResult.modifiedCount;
            created = writeResult.insertedCount;
            errors = writeQueries.length - updated - created;
        } catch (err) {
            logger.error(err);
            // FIXME These values are probably inaccurate due to possibility of partial writes.
            updated = 0;
            created = 0;
            errors = writeQueries.length;
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameServant);
        }
        return { updated, created, errors };
    }

    /**
     * Generates a database bulkWrite query for the imported servant. 
     */
    private async _createServantWriteQuery(
        servant: GameServantWithMetadata,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameServantBulkWriteQuery | null> {
        if (existingAction === GameDataImportExistingAction.Override) {
            return await this._createServantWriteForOverrideAction(servant, logger);
        } else if (existingAction === GameDataImportExistingAction.Append) {
            return await this._createServantWriteForAppendAction(servant, logger);
        } else {
            return await this._createServantWriteForSkipAction(servant, logger);
        }
    }

    /**
     * Creates a write query for the imported servant if it does not already exist
     * in the database.
     */
    private async _createServantWriteForSkipAction(
        servant: GameServantWithMetadata,
        logger: TransformLogger
    ): Promise<GameServantBulkWriteQuery | null> {
        const exists = await this._gameServantService.existsById(servant._id);
        if (!exists) {
            logger.info(servant._id, 'Servant does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: servant }
            };
        }
        logger.info(servant._id, 'Servant already exists, write operation will be skipped.');
        return null;
    }

    /**
     * Creates a write query for the imported servant. If the servant already
     * exists, then overrides all the fields in the existing servant with any
     * non-null and non-undefined fields from the imported servant.
     */
    private async _createServantWriteForOverrideAction(
        servant: GameServantWithMetadata,
        logger: TransformLogger
    ): Promise<GameServantBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameServantService.findById(servant._id);
        if (!existing) {
            logger.info(servant._id, 'Servant does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: servant }
            };
        }
        for (const [key, value] of Object.entries(servant)) {
            if (key === 'metadata') {
                this._overrideServantMetadata(value as GameServantMetadata, existing.metadata);
            } else if (value == null) {
                continue;
            } else {
                (existing as any)[key] = value;
            }
        }
        logger.info(servant._id, 'Servant already exists, existing data will be overridden.');
        return {
            updateOne: {
                filter: { _id: servant._id },
                update: { $set: existing }
            }
        };
    }

    private _overrideServantMetadata(source: GameServantMetadata, target: GameServantMetadata): void {
        if (source.fgoManagerName) {
            target.fgoManagerName = source.fgoManagerName;
        }
        if (source.searchTags.length) {
            target.searchTags = source.searchTags;
        }
        if (source.links.length) {
            target.links = source.links;
        }
    }

    /**
     * Creates a write query for the imported servant. If the servant already
     * exists, then copies any non-null and non-undefined fields from the
     * imported servant to the existing servant only if they are null or
     * undefined in the existing servant.
     */
    private async _createServantWriteForAppendAction(
        servant: GameServantWithMetadata,
        logger: TransformLogger
    ): Promise<GameServantBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameServantService.findById(servant._id);
        if (!existing) {
            logger.info(servant._id, 'Servant does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: servant }
            };
        }
        for (const [key, value] of Object.entries(servant)) {
            if (key === 'metadata') {
                this._appendServantMetadata(value as GameServantMetadata, existing.metadata);
            } else if (value == null || (existing as any)[key] != null) {
                continue;
            } else {
                (existing as any)[key] = value;
            }
        }
        /**
         * Always update costumes and noble phantasms
         */
        existing.costumes = servant.costumes;
        existing.np = servant.np;
        
        logger.info(servant._id, 'Servant already exists, existing data will be updated.');
        return {
            updateOne: {
                filter: { _id: servant._id },
                update: { $set: existing }
            }
        };
    }

    private _appendServantMetadata(source: GameServantMetadata, target: GameServantMetadata): void {
        if (source.fgoManagerName && !target.fgoManagerName) {
            target.fgoManagerName = source.fgoManagerName;
        }
        if (source.searchTags.length) {
            const existingTags = target.searchTags.map(searchTag => searchTag.value.toLowerCase());
            for (const searchTag of source.searchTags) {
                if (existingTags.includes(searchTag.value.toLowerCase())) {
                    continue;
                }
                target.searchTags.push(searchTag);
            }
        }
        if (source.links.length) {
            const existingLinks = target.links.map(link => link.label.toLowerCase());
            for (const link of source.links) {
                if (existingLinks.includes(link.url.toLowerCase())) {
                    continue;
                }
                target.links.push(link);
            }
        }
    }

    //#endregion


    //#region Item methods

    /**
     * Writes the imported items to the database according to the options.
     */
    private async _writeItems(
        items: Array<GameItem>,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameDataImportResult> {
        /**
         * The queries for the bulk write operation.
         */
        const writeQueries: Array<GameItemBulkWriteQuery> = [];
        /**
         * Create a bulk write query for each item an adds it to the query array.
         */
        for (const item of items) {
            const writeQuery = await this._createItemWriteQuery(item, existingAction, logger);
            if (writeQuery === null) {
                continue;
            }
            writeQueries.push(writeQuery);
        }
        let updated: number, created: number, errors: number;
        try {
            // TODO Move this to service layer
            const writeResult = await GameItemModel.bulkWrite(writeQueries, { ordered: false });
            updated = writeResult.modifiedCount;
            created = writeResult.insertedCount;
            errors = writeQueries.length - updated - created;
        } catch (err) {
            logger.error(err);
            // FIXME These values are probably inaccurate due to possibility of partial writes.
            updated = 0;
            created = 0;
            errors = writeQueries.length;
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameItem);
        }
        return { updated, created, errors };
    }

    /**
     * Generates a database bulkWrite query for the imported item. 
     */
    private async _createItemWriteQuery(
        item: GameItem,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameItemBulkWriteQuery | null> {
        if (existingAction === GameDataImportExistingAction.Override) {
            return await this._createItemWriteForOverrideAction(item, logger);
        } else if (existingAction === GameDataImportExistingAction.Append) {
            return await this._createItemWriteForAppendAction(item, logger);
        } else {
            return await this._createItemWriteForSkipAction(item, logger);
        }
    }

    /**
     * Creates a write query for the imported item if it does not already exist in
     * the database.
     */
    private async _createItemWriteForSkipAction(
        item: GameItem,
        logger: TransformLogger
    ): Promise<GameItemBulkWriteQuery | null> {
        const exists = await this._gameItemService.existsById(item._id);
        if (!exists) {
            logger.info(item._id, 'Item does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: item }
            };
        }
        logger.info(item._id, 'Item already exists, write operation will be skipped.');
        return null;
    }

    /**
     * Creates a write query for the imported item. If the item already exists, then
     * overrides all the fields in the existing item with any non-null and
     * non-undefined fields from the imported item.
     */
    private async _createItemWriteForOverrideAction(
        item: GameItem,
        logger: TransformLogger
    ): Promise<GameItemBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameItemService.findById(item._id);
        if (!existing) {
            logger.info(item._id, 'Item does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: item }
            };
        }
        for (const [key, value] of Object.entries(item)) {
            if (value == null) {
                continue;
            }
            (existing as any)[key] = value;
        }
        logger.info(item._id, 'Item already exists, existing data will be overridden.');
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $set: existing }
            }
        };
    }

    /**
     * Creates a write query for the imported item. If the item already exists, then
     * copies any non-null and non-undefined fields from the imported item to the
     * existing item only if they are null or undefined in the existing item.
     */
    private async _createItemWriteForAppendAction(
        item: GameItem,
        logger: TransformLogger
    ): Promise<GameItemBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameItemService.findById(item._id);
        if (!existing) {
            logger.info(item._id, 'Item does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: item }
            };
        }
        for (const [key, value] of Object.entries(item)) {
            if (value == null || (existing as any)[key] != null) {
                continue;
            }
            (existing as any)[key] = value;
        }
        logger.info(item._id, 'Item already exists, existing data will be updated.');
        return {
            updateOne: {
                filter: { _id: item._id },
                update: { $set: existing }
            }
        };
    }

    //#endregion


    //#region Soundtrack methods

    /**
     * Writes the imported soundtracks to the database according to the options.
     */
    private async _writeSoundtracks(
        soundtracks: Array<GameSoundtrack>,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameDataImportResult> {
        /**
         * The queries for the bulk write operation.
         */
        const writeQueries: Array<GameSoundtrackBulkWriteQuery> = [];
        /**
         * Create a bulk write query for each soundtrack an adds it to the query array.
         */
        for (const soundtrack of soundtracks) {
            const writeQuery = await this._createSoundtrackWriteQuery(soundtrack, existingAction, logger);
            if (writeQuery === null) {
                continue;
            }
            writeQueries.push(writeQuery);
        }
        let updated: number, created: number, errors: number;
        try {
            // TODO Move this to service layer
            const writeResult = await GameSoundtrackModel.bulkWrite(writeQueries, { ordered: false });
            updated = writeResult.modifiedCount;
            created = writeResult.insertedCount;
            errors = writeQueries.length - updated - created;
        } catch (err) {
            logger.error(err);
            // FIXME These values are probably inaccurate due to possibility of partial writes.
            updated = 0;
            created = 0;
            errors = writeQueries.length;
        }
        if (updated || created) {
            this._responseCacheManager.invalidateCache(ResponseCacheKey.GameSoundtrack);
        }
        return { updated, created, errors };
    }

    /**
     * Generates a database bulkWrite query for the imported soundtrack. 
     */
    private async _createSoundtrackWriteQuery(
        soundtrack: GameSoundtrack,
        existingAction: GameDataImportExistingAction,
        logger: TransformLogger
    ): Promise<GameSoundtrackBulkWriteQuery | null> {
        if (existingAction === GameDataImportExistingAction.Override) {
            return await this._createSoundtrackWriteForOverrideAction(soundtrack, logger);
        } else if (existingAction === GameDataImportExistingAction.Append) {
            return await this._createSoundtrackWriteForAppendAction(soundtrack, logger);
        } else {
            return await this._createSoundtrackWriteForSkipAction(soundtrack, logger);
        }
    }

    /**
     * Creates a write query for the imported soundtrack if it does not already
     * exist in the database.
     */
    private async _createSoundtrackWriteForSkipAction(
        soundtrack: GameSoundtrack,
        logger: TransformLogger
    ): Promise<GameSoundtrackBulkWriteQuery | null> {
        const exists = await this._gameSoundtrackService.existsById(soundtrack._id);
        if (!exists) {
            logger.info(soundtrack._id, 'Soundtrack does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: soundtrack }
            };
        }
        logger.info(soundtrack._id, 'Soundtrack already exists, write operation will be skipped.');
        return null;
    }

    /**
     * Creates a write query for the imported soundtrack. If the soundtrack already
     * exists, then overrides all the fields in the existing soundtrack with any
     * non-null and non-undefined fields from the imported soundtrack.
     */
    private async _createSoundtrackWriteForOverrideAction(
        soundtrack: GameSoundtrack,
        logger: TransformLogger
    ): Promise<GameSoundtrackBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameSoundtrackService.findById(soundtrack._id);
        if (!existing) {
            logger.info(soundtrack._id, 'Soundtrack does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: soundtrack }
            };
        }
        for (const [key, value] of Object.entries(soundtrack)) {
            if (value == null) {
                continue;
            }
            (existing as any)[key] = value;
        }
        logger.info(soundtrack._id, 'Soundtrack already exists, existing data will be overridden.');
        return {
            updateOne: {
                filter: { _id: soundtrack._id },
                update: { $set: existing }
            }
        };
    }

    /**
     * Creates a write query for the imported soundtrack. If the soundtrack already
     * exists, then copies any non-null and non-undefined fields from the imported
     * soundtrack to the existing soundtrack only if they are null or undefined in
     * the existing soundtrack.
     */
    private async _createSoundtrackWriteForAppendAction(
        soundtrack: GameSoundtrack,
        logger: TransformLogger
    ): Promise<GameSoundtrackBulkWriteQuery> {
        // TODO We should change the database method to return a lean document.
        const existing = await this._gameSoundtrackService.findById(soundtrack._id);
        if (!existing) {
            logger.info(soundtrack._id, 'Soundtrack does not exist yet, will be inserted into the database.');
            return {
                insertOne: { document: soundtrack }
            };
        }
        for (const [key, value] of Object.entries(soundtrack)) {
            if (value == null || (existing as any)[key] != null) {
                continue;
            }
            (existing as any)[key] = value;
        }
        logger.info(soundtrack._id, 'Soundtrack already exists, existing data will be updated.');
        return {
            updateOne: {
                filter: { _id: soundtrack._id },
                update: { $set: existing }
            }
        };
    }

    //#endregion

}