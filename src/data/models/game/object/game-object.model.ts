import { GameObject } from 'data/types';
import { Document, Model } from 'mongoose';

/**
 * Mongoose document data model definition for the `GameObject` base type.
 */
export type GameObjectModel<T extends GameObject & Document> = Model<T> & {

    /**
     * Properties that can be used as sort keys for the data model.
     */
    readonly SortProperties: string[];

    // TODO Add metadata queries

};

/**
 * Properties that can be used as sort keys for the `GameObject` base type.
 */
export const SortProperties = [
    '_id',
    'displayName'
];

/**
 * Properties and functions that can be assigned as statics on `GameObject`
 * schemas.
 */
export const Statics = {
    SortProperties
};
