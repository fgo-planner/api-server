import { GameCraftEssence } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameObjectSchemaTextIndex } from './game-object.model';
import { GamePlayerObjectModel, GamePlayerObjectSchemaDefinition, Statics as GamePlayerObjectModelStatics } from './game-player-object.model';

export type GameCraftEssenceDocument = Document & GameCraftEssence;

/**
 * Mongoose document model definition for the `GameCraftEssence` type.
 */
type GameCraftEssenceModel = GamePlayerObjectModel<GameCraftEssenceDocument>;

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

// Add static functions for `GamePlayerObjectModel`.
Object.assign(GameCraftEssenceSchema.statics, GamePlayerObjectModelStatics);

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

export const GameCraftEssenceModel = mongoose.model<GameCraftEssenceDocument, GameCraftEssenceModel>('GameCraftEssence', GameCraftEssenceSchema, 'GameCraftEssences');