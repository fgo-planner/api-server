/*
 * Contains the mongoose schema and model definitions and static function
 * implementations for the `GamePlayerObject` base (abstract) type. Does not
 * contain an actual mongoose model since `GamePlayerObject` is not a concrete
 * type.
 */

import { GamePlayerObject, GameRegion } from 'data/types';
import { Document, DocumentQuery, NativeError, Query, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { UrlStringUtils } from 'utils';
import { GameObjectModel, GameObjectSchemaDefinition } from './game-object.model';

/**
 * Mongoose document model definition for the `GamePlayerObject` base type.
 */
export type GamePlayerObjectModel<T extends GamePlayerObject & Document> = GameObjectModel<T> & {

    /**
     * Creates a Query for retrieving all the unique gameId values in the
     * colleciton. 
     */
    findAllGameIds: (callback?: (err: NativeError, res: number[]) => void) => Query<number[]>;

    /**
     * Creates a Query for retrieving all the unique urlString values in the
     * colleciton.
     */
    findAllUrlStrings: (callback?: (err: NativeError, res: string[]) => void) => Query<string[]>;

    /**
     * Creates a Query to find a single document by its urlString field.
     */
    findByUrlString: (urlString: string, callback?: (err: NativeError, res: T) => void) => DocumentQuery<T, T>;

    /**
     * Returns true if at least one document exists in the collection has the
     * urlString, and false otherwise.
     */
    existsByUrlString: (urlString: string, callback?: (err: NativeError, res: boolean) => void) => Promise<boolean>;

};


//#region Schema definitions

/**
 * Mongoose schema for the `GameRegion` enum.
 */
const GameRegionsSchema: Schema = new Schema({
    [GameRegion.NA]: {
        type: Boolean,
        required: false
    },
    [GameRegion.JP]: {
        type: Boolean,
        required: true,
        default: true
    },
    [GameRegion.CN]: {
        type: Boolean,
        required: false
    },
    [GameRegion.KR]: {
        type: Boolean,
        required: false
    },
    [GameRegion.TW]: {
        type: Boolean,
        required: false
    }
}, { _id: false });

/**
 * Mongoose schema definition for the `GamePlayerObject` base type.
 */
export const GamePlayerObjectSchemaDefinition: SchemaDefinition = {
    ...GameObjectSchemaDefinition,
    urlString: {
        type: String,
        required: true,
        unique: true,
        validate: [
            UrlStringUtils.isValid,
            'Invalid URL string format.'
        ]
    },
    gameId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        unique: true
    },
    gameRegions: {
        type: GameRegionsSchema,
        required: true,
        default: {
            [GameRegion.JP]: true
        }
    }
};

//#endregion


//#region Static function implementations

const findAllGameIds = function<T extends GamePlayerObject & Document> (
    this: GamePlayerObjectModel<T>,
    callback?: (err: NativeError, res: number[]) => void
) {
    return this.distinct('gameId', callback) as Query<number[]>;
};

const findAllUrlStrings = function<T extends GamePlayerObject & Document> (
    this: GamePlayerObjectModel<T>,
    callback?: (err: NativeError, res: string[]) => void
) {
    return this.distinct('urlString', callback) as Query<string[]>;
};

const findByUrlString = function<T extends GamePlayerObject & Document> (
    this: GamePlayerObjectModel<T>,
    urlString: string,
    callback?: (err: NativeError, res: T) => void
) {
    return this.findOne({ urlString } as any, callback);
};

const existsByUrlString = function<T extends GamePlayerObject & Document> (
    this: GamePlayerObjectModel<T>,
    urlString: string,
    callback?: (err: NativeError, res: boolean) => void
) {
    return this.exists({ urlString } as any, callback);
};

export const Statics = {
    findAllGameIds,
    findAllUrlStrings,
    findByUrlString,
    existsByUrlString
};

//#endregion
