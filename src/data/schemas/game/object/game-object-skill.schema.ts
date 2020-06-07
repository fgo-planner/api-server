import { SchemaDefinition, Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSkillEffectSchema } from './game-object-skill-effect.schema';

/**
 * Mongoose schema definition for the `GameObjectSkill` type.
 */
export const GameObjectSkillSchemaDefinition: SchemaDefinition = {
    skillId: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        required: true,
        index: true
    },
    effects: {
        type: [GameObjectSkillEffectSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameObjectSkill` type.
 */
export const GameObjectSkillSchema = new Schema(GameObjectSkillSchemaDefinition, { _id: false, storeSubdocValidationError: false });
