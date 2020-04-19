import { GameEnemy } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameCharacterSchema, GameObjectSchemaTextIndex } from '../../common-schema-definitions';

export type GameEnemyDocument = Document & GameEnemy;

const schemaDefinition: SchemaDefinition = {
    ...GameCharacterSchema,
};

const schema = new Schema(schemaDefinition, { timestamps: true });

// Add text index
schema.index(
    GameObjectSchemaTextIndex,
    {
        name: 'textIndex',
        weights: {
            name: 5,
            nameJp: 3
        }
    }
);

export const GameEnemyModel = mongoose.model<GameEnemyDocument>('GameEnemy', schema, 'GameEnemies');