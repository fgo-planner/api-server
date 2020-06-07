import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';

/**
 * Mongoose schema definition for the `GameSkillBuff` type.
 */
export const GameSkillBuffSchemaDefinition: SchemaDefinition = {
    _id: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    name: {
        type: String
    },
    nameJp: {
        type: String
    },
    description: {
        type: String
    },
    descriptionJp: {
        type: String
    },
    iconId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    },
    iconId2: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    }
};
