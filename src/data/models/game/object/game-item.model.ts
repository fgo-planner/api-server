import { GameItem, GameItemCategory } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameObjectSchemaTextIndex } from './game-object.model';
import { GamePlayerObjectModel, GamePlayerObjectSchemaDefinition, Statics as GamePlayerObjectModelStatics } from './game-player-object.model';

export type GameItemDocument = Document & GameItem;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameItemModel = GamePlayerObjectModel<GameItemDocument>;

/**
 * Mongoose schema definition for the `GameItem` model.
 */
const GameItemSchemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchemaDefinition,
    description: String,
    categories: {
        type: [String],
        enum: Object.keys(GameItemCategory),
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameItem` model.
 */
const GameItemSchema = new Schema(GameItemSchemaDefinition, { timestamps: true });

// Add static functions for `GamePlayerObjectModel`.
Object.assign(GameItemSchema.statics, GamePlayerObjectModelStatics);

// Add text index
GameItemSchema.index({
    ...GameObjectSchemaTextIndex,
    description: 'text'
}, {
    name: 'textIndex',
    weights: {
        urlString: 5,
        name: 5,
        nameJp: 4,
        description: 1
    }
});

export const GameItemModel = mongoose.model<GameItemDocument, GameItemModel>('GameItem', GameItemSchema, 'GameItems');
