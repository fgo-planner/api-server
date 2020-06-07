import { GameSkillEffectSchemaDefinition } from 'data/schemas';
import { GameSkillEffect } from 'data/types';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type GameSkillEffectDocument = GameSkillEffect & Document;

/**
 * Mongoose document model definition for the `GameSkillEffect` type.
 */
type GameSkillEffectModel = Model<GameSkillEffectDocument>;

/**
 * Mongoose schema for the `GameSkillEffect` type.
 */
const GameSkillEffectSchema = new Schema(GameSkillEffectSchemaDefinition, { timestamps: true });

GameSkillEffectSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const GameSkillEffectModel = mongoose.model<GameSkillEffectDocument, GameSkillEffectModel>('GameSkillEffect', GameSkillEffectSchema, 'GameSkillEffects');
