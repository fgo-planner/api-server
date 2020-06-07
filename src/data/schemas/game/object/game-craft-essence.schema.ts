import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSkillSchema } from './game-object-skill.schema';
import { GameSpiritOriginCollectionSchemaDefinition } from './game-spirit-origin-collection.schema';

/**
 * Mongoose schema definition for the `GameCraftEssence` type.
 */
export const GameCraftEssenceSchemaDefinition: SchemaDefinition = {
    ...GameSpiritOriginCollectionSchemaDefinition,
    cost: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1,
        index: true
    },
    skill: {
        type: GameObjectSkillSchema,
        required: true,
        default: {}
    }
};
