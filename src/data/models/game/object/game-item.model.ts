import { GameItemSchemaDefinition } from 'data/schemas';
import { GameItem, GameItemType } from 'data/types';
import mongoose, { Document, Schema, NativeError, DocumentQuery } from 'mongoose';
import { GameObjectRegionalModel, SortProperties as GameObjectRegionalSortProperties, Statics as GameObjectRegionalStatics } from './game-object-regional.model';

export type GameItemDocument = Document & GameItem;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameItemModel = GameObjectRegionalModel<GameItemDocument> & {

    /**
     * Creates a Query for retrieving the items that belong to any of the given
     * categories from the collection.
     */
    findByCategories: (categories: GameItemType | GameItemType[], callback?: (err: NativeError, res: GameItemDocument[]) => void) =>
        DocumentQuery<GameItemDocument[], GameItemDocument>;

};

//#region Static function implementations

const findByCategories = function (
    this: GameItemModel,
    categories: GameItemType | GameItemType[],
    callback?: (err: NativeError, res: GameItemDocument[]) => void
) {
    if (!Array.isArray(categories)) {
        categories = [categories];
    }
    return this.findOne({ 'categories': { $in: categories } } as any, callback);
};

//#endregion

/**
 * Properties that can be used as sort keys.
 */
const SortProperties = [
    ...GameObjectRegionalSortProperties,
    'rarity'
];

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    ...GameObjectRegionalStatics,
    findByCategories,
    SortProperties
};

/**
 * Mongoose schema for the `GameItem` type.
 */
const GameItemSchema = new Schema(GameItemSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(GameItemSchema.statics, Statics);

GameItemSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

// Add text index
// TODO Redo this
/*
GameItemSchema.index({
    ...GameObjectSchemaTextIndex,
    description: 'text'
}, {
    name: 'textIndex',
    weights: {
        urlPath: 5,
        name: 5,
        nameJp: 4,
        description: 1
    }
});
*/

export const GameItemModel = mongoose.model<GameItemDocument, GameItemModel>('GameItem', GameItemSchema, 'GameItems');
