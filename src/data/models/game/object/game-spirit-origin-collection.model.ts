import { GameSpiritOriginCollection } from 'data/types';
import { Document, DocumentQuery, NativeError } from 'mongoose';
import { GameSpiritOriginModel, SortProperties as GameSpiritOriginSortProperties, Statics as GameSpiritOriginStatics } from './game-spirit-origin.model';

/**
 * Mongoose document data model definition for the `GameSpiritOriginCollection`
 * base type.
 */
export type GameSpiritOriginCollectionModel<T extends GameSpiritOriginCollection & Document> = GameSpiritOriginModel<T> & {

    /**
     * Creates a Query to find a single document by its `collectionNo` field.
     */
    findByCollectionNo: (collectionNo: number, callback?: (err: NativeError, res: T) => void) => DocumentQuery<T, T>;

    /**
     * Creates a Query for retrieving all the documents with the given
     * `illustratorId` in the collection.
     */
    findByIllustratorId: (illustratorId: number, callback?: (err: NativeError, res: T[]) => void) => DocumentQuery<T[], T>;

};

//#region Static function implementations

const findByCollectionNo = function <T extends GameSpiritOriginCollection & Document>(
    this: GameSpiritOriginCollectionModel<T>,
    collectionNo: number,
    callback?: (err: NativeError, res: T) => void
) {
    return this.findOne({ collectionNo } as any, callback);
};

const findByIllustratorId = function <T extends GameSpiritOriginCollection & Document>(
    this: GameSpiritOriginCollectionModel<T>,
    illustratorId: number,
    callback?: (err: NativeError, res: T[]) => void
) {
    return this.find({ 'metadata.illustratorId': illustratorId } as any, callback);
};

//#endregion

/**
 * Properties that can be used as sort keys for the `GameObjectRegional` base
 * type.
 */
export const SortProperties = [
    ...GameSpiritOriginSortProperties,
    'collectionNo'
];

/**
 * Properties and functions that can be assigned as statics on
 * `GameObjectRegional` schemas.
 */
export const Statics = {
    ...GameSpiritOriginStatics,
    findByCollectionNo,
    findByIllustratorId,
    SortProperties
};
