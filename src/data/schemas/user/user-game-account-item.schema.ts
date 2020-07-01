import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema for the `UserGameAccountItem` type.
 */
export const UserGameAccountItemSchema = new Schema({
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
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    }
}, { _id: false, storeSubdocValidationError: false });
