import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSkillSchemaDefinition } from './game-object-skill.schema';

/**
 * Mongoose schema definition for the `GameObjectSkillLevelable` type.
 */
export const GameObjectSkillLevelableSchemaDefinition: SchemaDefinition = {
    ...GameObjectSkillSchemaDefinition,
    baseCooldown: {
        type: Number,
        required: true,
        min: 3,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 3
    }
};

/**
 * Mongoose schema for the `GameObjectSkillLevelable` type.
 */
export const GameObjectSkillLevelableSchema = new Schema(GameObjectSkillLevelableSchemaDefinition, { _id: false, storeSubdocValidationError: false });
