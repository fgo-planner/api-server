import { GameCraftEssenceSchemaDefinition } from 'data/schemas';
import { GameCraftEssence } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';
import { GameSpiritOriginCollectionModel, Statics as GameSpiritOriginCollectionStatics, SortProperties as GameSpiritOriginCollectionSortProperties } from './game-spirit-origin-collection.model';

export type GameCraftEssenceDocument = Document & GameCraftEssence;

/**
 * Mongoose document model definition for the `GameCraftEssence` type.
 */
type GameCraftEssenceModel = GameSpiritOriginCollectionModel<GameCraftEssenceDocument>;

/**
 * Properties that can be used as sort keys.
 */
const SortProperties = [
    ...GameSpiritOriginCollectionSortProperties,
    'cost'
];

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    ...GameSpiritOriginCollectionStatics,
    SortProperties
};

/**
 * Mongoose schema for the `GameCraftEssence` type.
 */
const GameCraftEssenceSchema = new Schema(GameCraftEssenceSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(GameCraftEssenceSchema.statics, Statics);

GameCraftEssenceSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

// Add text index
// TODO Redo this
/*
GameCraftEssenceSchema.index(
    GameObjectSchemaTextIndex,
    {
        name: 'textIndex',
        weights: {
            urlPath: 5,
            name: 5,
            nameJp: 3,
        }
    }
);
*/

export const GameCraftEssenceModel = mongoose.model<GameCraftEssenceDocument, GameCraftEssenceModel>('GameCraftEssence', GameCraftEssenceSchema, 'GameCraftEssences');
