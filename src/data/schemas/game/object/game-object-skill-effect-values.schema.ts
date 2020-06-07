import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';

/**
 * Mongoose schema for the `GameObjectSkillEffectValues` type.
 */
export const GameObjectSkillEffectValuesSchema = new Schema({
    turns: {
        type: Number,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    count: {
        type: Number,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    successRates: {
        type: [Number],
        // TODO Validate that all values are integers
        required: true,
        default: []
    },
    values: {
        type: [Number],
        // TODO Validate that all values are integers
        required: true,
        default: []
    }
}, { _id: false, storeSubdocValidationError: false });
