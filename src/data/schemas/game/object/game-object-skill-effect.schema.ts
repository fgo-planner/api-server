import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSkillEffectValuesSchema } from './game-object-skill-effect-values.schema';

/**
 * Mongoose schema definition for the `GameObjectSkillEffect` type.
 */
export const GameObjectSkillEffectSchemaDefinition: SchemaDefinition = {
    effectId: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        required: true,
        index: true
    },
    values: {
        type: [GameObjectSkillEffectValuesSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameObjectSkillEffect` type.
 */
export const GameObjectSkillEffectSchema = new Schema(GameObjectSkillEffectSchemaDefinition, { _id: false, storeSubdocValidationError: false });
