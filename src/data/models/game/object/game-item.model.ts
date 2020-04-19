import { GameItem, GameItemCategory } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameObjectSchemaTextIndex, GamePlayerObjectSchema } from './game-object-schema-definitions';

export type GameItemDocument = Document & GameItem;

const schemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchema,
    description: String,
    categories: {
        type: [String],
        enum: Object.keys(GameItemCategory),
        required: true,
        default: []
    }
};

const schema = new Schema(schemaDefinition, { timestamps: true });

// Add text index
schema.index({
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

export const GameItemModel = mongoose.model<GameItemDocument>('GameItem', schema, 'GameItems');