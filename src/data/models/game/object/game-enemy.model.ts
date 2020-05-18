import { GameEnemy } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameCharacterSchemaDefinition, GameCharacterModel } from './game-character.model';
import { GameObjectSchemaTextIndex } from './game-object.model';

export type GameEnemyDocument = Document & GameEnemy;

/**
 * Mongoose document model definition for the `GameEnemy` type.
 */
type GameEnemyModel = GameCharacterModel<GameEnemyDocument>;

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

export const GameEnemyModel = mongoose.model<GameEnemyDocument, GameEnemyModel>('GameEnemy', GameEnemySchema, 'GameEnemies');