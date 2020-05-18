/*
 * Contains the mongoose schema and model definitions for the `GameCharacter`
 * base (abstract) type. Does not contain an actual mongoose model since
 * `GameCharacter` is not a concrete type.
 */

import { GameCharacterAttribute, GameCharacterClass, GameObject } from 'data/types';
import { Document, SchemaDefinition } from 'mongoose';
import { GameObjectModel, GameObjectSchemaDefinition } from './game-object.model';

/**
 * Mongoose document model definition for the `GameCharacter` base type.
 */
export type GameCharacterModel<T extends GameObject & Document> = GameObjectModel<T>;

/**
 * Mongoose schema definition for the `GameCharacter` base type.
 */
export const GameCharacterSchemaDefinition: SchemaDefinition = {
    ...GameObjectSchemaDefinition,
    class: {
        type: String,
        enum: Object.keys(GameCharacterClass),
        required: true,
        default: GameCharacterClass.Shielder
    },
    attribute: {
        type: String,
        enum: Object.keys(GameCharacterAttribute),
        required: true,
        default: GameCharacterAttribute.Earth
    }
};