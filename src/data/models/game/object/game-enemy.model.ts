import { GameEnemy } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameCharacterSchemaDefinition, GameObjectSchemaTextIndex } from './game-object-schema-definitions';

export type GameEnemyDocument = Document & GameEnemy;

/**
 * Mongoose schema definition for the `GameEnemy` model.
 */
const GameEnemySchemaDefinition: SchemaDefinition = {
    ...GameCharacterSchemaDefinition,
};

/**
 * Mongoose schema definition for the `GameEnemy` model.
 */
const GameEnemySchema = new Schema(GameEnemySchemaDefinition, { timestamps: true });

// Add text index
GameEnemySchema.index(
    GameObjectSchemaTextIndex,
    {
        name: 'textIndex',
        weights: {
            name: 5,
            nameJp: 3
        }
    }
);

export const GameEnemyModel = mongoose.model<GameEnemyDocument>('GameEnemy', GameEnemySchema, 'GameEnemies');