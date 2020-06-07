import { GameSkillRank, GameSkillType } from 'data/types';
import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';

/**
 * Mongoose schema definition for the `GameSkill` type.
 */
export const GameSkillSchemaDefinition: SchemaDefinition = {
    _id: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    type: {
        type: String,
        enum: Object.keys(GameSkillType),
        required: true,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    nameJp: {
        type: String,
        // TODO Index this?
    },
    rank: {
        type: String,
        enum: Object.keys(GameSkillRank)
    },
    rankUpper: {
        type: String,
        enum: Object.keys(GameSkillRank)
        // TODO Add mongoose middleware validation to ensure that if this is populated, then `rank` is also populated.
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
    effectIds: {
        type: [Number],
        required: true,
        // TODO Validate that all values are positive integers
        default: [],
        index: true
    }
};
