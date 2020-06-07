import { GameObjectRegional } from 'data/types';
import { Document } from 'mongoose';
import { GameObjectModel, SortProperties as GameObjectSortProperties, Statics as GameObjectStatics } from './game-object.model';

/**
 * Mongoose document data model definition for the `GameObjectRegional` base
 * type.
 */
export type GameObjectRegionalModel<T extends GameObjectRegional & Document> = GameObjectModel<T>;

//#region Static function implementations

// TODO Add functions here

//#endregion

/**
 * Properties that can be used as sort keys for the `GameObjectRegional` base
 * type.
 */
export const SortProperties = [
    ...GameObjectSortProperties
];

/**
 * Properties and functions that can be assigned as statics on
 * `GameObjectRegional` schemas.
 */
export const Statics = {
    ...GameObjectStatics,
    SortProperties
};
