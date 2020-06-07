import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema for the `GameServantUpgrade.materials` property.
 */
const GameServantUpgradeMaterialsSchema = new Schema({
    itemId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
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
 * Mongoose schema for the `GameServantUpgrade` type.
 */
export const GameServantUpgradeSchema = new Schema({
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
        type: [GameServantUpgradeMaterialsSchema],
        required: true,
        default: []
    }
}, { _id: false, storeSubdocValidationError: false });
