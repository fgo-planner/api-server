import { GameSkillBuffSchemaDefinition } from 'data/schemas';
import { GameSkillBuff } from 'data/types';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type GameSkillBuffDocument = GameSkillBuff & Document;

/**
 * Mongoose document model definition for the `GameSkillBuff` type.
 */
type GameSkillBuffModel = Model<GameSkillBuffDocument>;

/**
 * Mongoose schema for the `GameSkillBuff` type.
 */
const GameSkillBuffSchema = new Schema(GameSkillBuffSchemaDefinition, { timestamps: true });

GameSkillBuffSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const GameSkillBuffModel = mongoose.model<GameSkillBuffDocument, GameSkillBuffModel>('GameSkillBuff', GameSkillBuffSchema, 'GameSkillBuffs');
