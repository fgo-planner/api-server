import { GameSpiritOrigin } from 'data/types';
import { Document } from 'mongoose';
import { GameObjectRegionalModel, SortProperties as GameObjectRegionalSortProperties, Statics as GameObjectRegionalStatics } from './game-object-regional.model';

/**
 * Mongoose document data model definition for the `GameSpiritOrigin` base
 * type.
 */
export type GameSpiritOriginModel<T extends GameSpiritOrigin & Document> = GameObjectRegionalModel<T>;

/**
 * Properties that can be used as sort keys for the `GameSpiritOrigin` base
 * type.
 */
export const SortProperties = [
    ...GameObjectRegionalSortProperties,
    'rarity'
];

/**
 * Properties and functions that can be assigned as statics on
 * `GameSpiritOrigin` schemas.
 */
export const Statics = {
    ...GameObjectRegionalStatics,
    SortProperties
};
