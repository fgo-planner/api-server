import { GameSkillSchemaDefinition } from 'data/schemas';
import { GameSkill } from 'data/types';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type GameSkillDocument = GameSkill & Document;

/**
 * Mongoose document model definition for the `GameSkill` type.
 */
type GameSkillModel = Model<GameSkillDocument>;

/**
 * Properties that can be used as sort keys.
 */
const SortProperties = [
    'type',
    'name',
    'icon'
];

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    SortProperties
};

/**
 * Mongoose schema for the `GameSkill` type.
 */
const GameSKillSchema = new Schema(GameSkillSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(GameSKillSchema.statics, Statics);

GameSKillSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const GameSkillModel = mongoose.model<GameSkillDocument, GameSkillModel>('GameSkill', GameSKillSchema, 'GameSkills');
