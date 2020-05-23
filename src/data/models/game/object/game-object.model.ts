/*
 * Contains the mongoose schema and model definitions and static function
 * implementations for the `GameObject` base (abstract) type. Does not contain
 * an actual mongoose model since `GameObject` is not a concrete type.
 */

import { GameObject } from 'data/types';
import { Document, Model, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose document model definition for the `GameObject` base type.
 */
export type GameObjectModel<T extends GameObject & Document> = Model<T>;

/**
 * Mongoose schema definition for the `GameObject` base type.
 */
export const GameObjectSchemaDefinition: SchemaDefinition = {
    name: {
        type: String,
        required: true,
        index: true
    },
    nameJp: {
        type: String,
    },
    rarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1,
        index: true
    },
    imageUrl: {
        type: String,
        // TODO Add URL path validation
    }
};

/**
 * Mongoose text index definition for the `GameObject` base type.
 */
export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlPath: 'text'
};