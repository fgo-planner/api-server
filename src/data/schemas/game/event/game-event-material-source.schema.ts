import { GameEventMaterialSourceType } from 'data/types';
import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema for the `GameEventMaterialSource.materials` property.
 */
const GameEventMaterialSourceMaterialsSchema = new Schema({
    itemId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameEventMaterialSource` type.
 */
export const GameEventMaterialSourceSchema = new Schema({
    type: {
        type: String,
        enum: Object.keys(GameEventMaterialSourceType),
        required: true
    },
    name: {
        type: String
    },
    currencyId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    materials: {
        type: [GameEventMaterialSourceMaterialsSchema],
        required: true,
        default: []
    }
}, { _id: false, storeSubdocValidationError: false });