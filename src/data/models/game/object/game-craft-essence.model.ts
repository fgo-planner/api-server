import { GameCraftEssence } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSchemaTextIndex, GamePlayerObjectSchemaDefinition } from './game-object-schema-definitions';

export type GameCraftEssenceDocument = Document & GameCraftEssence;

/**
 * Mongoose schema definition for the `GameCraftEssence` model.
 */
const GameCraftEssenceSchemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchemaDefinition,
    cost: {
        type: Number,
        required: true,
        min: 1,
        max: 12,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    },
};

/**
 * Mongoose schema for the `GameCraftEssence` model.
 */
const GameCraftEssenceSchema = new Schema(GameCraftEssenceSchemaDefinition, { timestamps: true });

// Add text index
GameCraftEssenceSchema.index(
    GameObjectSchemaTextIndex,
    {
        name: 'textIndex',
        weights: {
            urlString: 5,
            name: 5,
            nameJp: 3,
        }
    }
);

export const GameCraftEssenceModel = mongoose.model<GameCraftEssenceDocument>('GameCraftEssence', GameCraftEssenceSchema, 'GameCraftEssences');