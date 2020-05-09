// Contains common schema definitions that are used by `GameObject` models.

import { GameCharacterAttribute, GameCharacterClass, GameRegion } from 'data/types';
import { SchemaDefinition, Schema } from 'mongoose';
import { UrlStringUtils } from 'utils';
import { MongooseValidationStrings } from 'strings';

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
 * Mongoose schema definition for the `GameObject` base model.
 */
export const GameObjectSchemaDefinition: SchemaDefinition = {
    name: {
        type: String,
        required: true,
        index: true
    },
    nameJp: String,
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
    }
};

/**
 * Mongoose schema definition for the `GamePlayerObject` base model.
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

/**
 * Mongoose schema definition for the `GameCharacter` base model.
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

/**
 * Mongoose text index definition for the `GameObject` base model.
 */
export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlString: 'text'
};