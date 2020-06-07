import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';

/**
 * Mongoose schema definition for the `GameSkillEffect` type.
 */
export const GameSkillEffectSchemaDefinition: SchemaDefinition = {
    _id: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    text: {
        type: String
    },
    textJp: {
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
    },
    buffIds: {
        type: [Number],
        required: true,
        // TODO Validate that all values are positive integers
        default: [],
        index: true
    }
    // TODO Add the `valueUnits` field.
};
