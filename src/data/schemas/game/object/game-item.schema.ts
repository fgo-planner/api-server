import { GameItemType } from 'data/types';
import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectRegionalSchemaDefinition } from './game-object-regional.schema';

/**
 * Mongoose schema definition for the `GameItem` type.
 */
export const GameItemSchemaDefinition: SchemaDefinition = {
    ...GameObjectRegionalSchemaDefinition,
    // This overrides the `rarity` property in `GameSpiritOriginSchemaDefinition`.
    rarity: {
        type: Number,
        required: true,
        min: 1,
        max: 3,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1,
        index: true
    },
    description: {
        type: String
    },
    categories: {
        type: [String],
        enum: Object.keys(GameItemType),
        required: true,
        default: []
    }
};
