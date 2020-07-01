import { Schema } from 'mongoose';
import { NumberUtils } from 'utils';
import { MongooseValidationStrings } from 'strings';
import { UserGameAccountValidators } from 'data/validators';

/**
 * Mongoose schema for the `UserGameAccountServant.skillLevels` property.
 */
const UserGameAccountServantSkillLevelsSchema = new Schema({
    1: {
        type: Number,
        min: 1,
        max: 10,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    2: {
        type: Number,
        min: 1,
        max: 10,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    3: {
        type: Number,
        min: 1,
        max: 10,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    }
});

/**
 * Mongoose schema for the `UserGameAccountServant` type.
 */
export const UserGameAccountServantSchema = new Schema({
    gameId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    dateAcquired: {
        type: Date
        // TODO Add range validation
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    },
    ascensionLevel: {
        type: Number,
        required: true,
        min: 0,
        max: 4,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    bond: {
        type: Number,
        min: 1,
        max: 15,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    fouAtk: {
        type: Number,
        min: 0,
        max: 2000,
        validate: {
            validator: UserGameAccountValidators.isFouValueValid,
            message: MongooseValidationStrings.GenericInvalidValue
        }
    },
    fouHp: {
        type: Number,
        min: 0,
        max: 2000,
        validate: {
            validator: UserGameAccountValidators.isFouValueValid,
            message: MongooseValidationStrings.GenericInvalidValue
        }
    },
    skillLevels: {
        type: UserGameAccountServantSkillLevelsSchema,
        required: true,
        default: {}
    },
    noblePhantasmLevel: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    }
}, { _id: false, storeSubdocValidationError: false });