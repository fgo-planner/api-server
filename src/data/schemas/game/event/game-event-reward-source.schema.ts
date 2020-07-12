import { GameEventRewardSourceType } from 'data/types';
import { Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';

/**
 * Mongoose schema for the `GameEventRewardSource.materials` property.
 */
const GameEventRewardSourceMasterItemsSchema = new Schema({
    silverFous: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    goldFous: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    silverEmbers: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    goldEmbers: {
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
    },
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
    bronzeFruits: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    silverFruits: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    goldFruits: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    saintQuartz: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    summonTickets: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    flames: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    grails: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    lores: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    rerunLores: {
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
 * Mongoose schema for the `GameEventRewardSource.enhancementItems` property.
 */
const GameEventRewardSourceEnhancementItemsSchema = new Schema({
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
 * Mongoose schema for the `GameEventRewardSource` type.
 */
export const GameEventRewardSourceSchema = new Schema({
    type: {
        type: String,
        enum: Object.keys(GameEventRewardSourceType),
        required: true
    },
    name: {
        type: String
    },
    currencyId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: null
    },
    masterRewards: {
        type: GameEventRewardSourceMasterItemsSchema,
        required: true,
        default: {}
    },
    enhancementRewards: {
        type: [GameEventRewardSourceEnhancementItemsSchema],
        required: true,
        default: []
    }
}, { _id: false, storeSubdocValidationError: false });