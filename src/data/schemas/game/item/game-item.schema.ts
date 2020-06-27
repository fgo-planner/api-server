import { GameItemBackground, GameItemType } from 'data/types';
import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema definition for the `GameItem` type.
 */
export const GameItemSchemaDefinition: SchemaDefinition = {
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
    background: {
        type: String,
        enum: Object.keys(GameItemBackground),
        required: true,
        default: GameItemBackground.Bronze
    },
    type: {
        type: String,
        enum: Object.keys(GameItemType),
        required: true,
        index: true
    }
};
