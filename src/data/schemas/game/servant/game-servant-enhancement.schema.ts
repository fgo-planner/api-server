import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema for the `GameServantEnhancement.materials` property.
 */
const GameServantEnhancementMaterialsSchema = new Schema({
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
 * Mongoose schema for the `GameServantEnhancement` type.
 */
export const GameServantEnhancementSchema = new Schema({
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
    materials: {
        type: [GameServantEnhancementMaterialsSchema],
        required: true,
        default: []
    }
}, { _id: false, storeSubdocValidationError: false });
