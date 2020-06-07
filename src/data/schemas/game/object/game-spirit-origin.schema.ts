import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectRegionalSchemaDefinition } from './game-object-regional.schema';

/**
 * Mongoose schema for the `GameSpiritOrigin.sell` property.
 */
const GameSpiritOriginSellSchema = new Schema({
    qp: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    manaPrisms: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    rarePrisms: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameSpiritOrigin` base type.
 */
export const GameSpiritOriginSchemaDefinition: SchemaDefinition = {
    ...GameObjectRegionalSchemaDefinition,
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
    nameJpRuby: {
        type: String
    },
    sell: {
        type: GameSpiritOriginSellSchema,
        required: true,
        default: {}
    }
};
