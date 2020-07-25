import { GameItemSchemaDefinition } from 'data/schemas';
import { GameItem, GameItemType } from 'data/types';
import mongoose, { Document, Schema, NativeError, DocumentQuery, Model } from 'mongoose';

export type GameItemDocument = Document & GameItem;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameItemModel = Model<GameItemDocument> & {

    /**
     * Creates a Query for retrieving the items that belong to any of the given
     * types from the collection.
     */
    findByTypes: (categories: GameItemType | GameItemType[], callback?: (err: NativeError, res: GameItemDocument[]) => void) =>
        DocumentQuery<GameItemDocument[], GameItemDocument>;

};

//#region Static function implementations

const findByTypes = function (
    this: GameItemModel,
    types: GameItemType | GameItemType[],
    callback?: (err: NativeError, res: GameItemDocument[]) => void
) {
    if (!Array.isArray(types)) {
        types = [types];
    }
    return this.findOne({ type: { $in: types } }, callback);
};

//#endregion

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    findByTypes
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

export const GameItemModel = mongoose.model<GameItemDocument, GameItemModel>('GameItem', GameItemSchema, 'GameItems');
