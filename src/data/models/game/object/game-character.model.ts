/*
 * Contains the mongoose schema and model definitions for the `GameCharacter`
 * base (abstract) type. Does not contain an actual mongoose model since
 * `GameCharacter` is not meant to be used as a concrete type.
 */

import { GameCharacter, GameCharacterClass } from 'data/types';
import { Document, DocumentQuery, NativeError } from 'mongoose';
import { GameObjectModel, SortProperties as GameObjectSortProperties, Statics as GameObjectStatics } from './game-object.model';

/**
 * Mongoose document data model definition for the `GameCharacter` base type.
 */
export type GameCharacterModel<T extends GameCharacter & Document> = GameObjectModel<T> & {

    /**
     * Creates a Query to find a single document by its `class` field.
     */
    findByClass: (cls: GameCharacterClass, callback?: (err: NativeError, res: T) => void) => DocumentQuery<T, T>;

    // TODO Add additional query methods.

    /**
     * Creates a Query for retrieving all the documents with the given
     * `illustratorId` in the collection.
     */
    findByIllustratorId: (illustratorId: number, callback?: (err: NativeError, res: T[]) => void) => DocumentQuery<T[], T>;

    /**
     * Creates a Query for retrieving all the documents with the given
     * `cvId` in the collection.
     */
    findByCvId: (cvId: number, callback?: (err: NativeError, res: T[]) => void) => DocumentQuery<T[], T>;

};

//#region Static function implementations

const findByClass = function <T extends GameCharacter & Document>(
    this: GameCharacterModel<T>,
    cls: GameCharacterClass,
    callback?: (err: NativeError, res: T) => void
) {
    return this.findOne({ 'class': cls } as any, callback);
};

const findByIllustratorId = function <T extends GameCharacter & Document>(
    this: GameCharacterModel<T>,
    illustratorId: number,
    callback?: (err: NativeError, res: T[]) => void
) {
    return this.find({ 'metadata.illustratorId': illustratorId } as any, callback);
};

const findByCvId = function <T extends GameCharacter & Document>(
    this: GameCharacterModel<T>,
    cvId: number,
    callback?: (err: NativeError, res: T[]) => void
) {
    return this.find({ 'metadata.cvId': cvId } as any, callback);
};

//#endregion

/**
 * Properties that can be used as sort keys for the `GameCharacter` base type.
 */
export const SortProperties = [
    ...GameObjectSortProperties,
    'class',
    'attribute',
    'gender',
    'hpBase',
    'hpMax',
    'atkBase',
    'atkMax',
    'starRate',
    'deathRate',
    'criticalWeight'
];

/**
 * Properties and functions that can be assigned as statics on `GameCharacter`
 * schemas.
 */
export const Statics = {
    ...GameObjectStatics,
    findByClass,
    findByIllustratorId,
    findByCvId,
    SortProperties
};
