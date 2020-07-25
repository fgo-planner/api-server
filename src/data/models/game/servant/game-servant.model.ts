import { GameServantSchemaDefinition } from 'data/schemas';
import { GameServant, GameServantClass } from 'data/types';
import mongoose, { Document, DocumentQuery, Model, NativeError, Schema } from 'mongoose';

export type GameServantDocument = Document & GameServant;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameServantModel = Model<GameServantDocument> & {

    /**
     * Creates a Query to find a single document by its `collectionNo` field.
     */
    findByCollectionNo: (collectionNo: number, callback?: (err: NativeError, res: GameServantDocument) => void) =>
        DocumentQuery<GameServantDocument, GameServantDocument>;

    /**
     * Creates a Query for retrieving all the documents with the given `class` in
     * the collection.
     */
    findByClass: (cls: GameServantClass, callback?: (err: NativeError, res: GameServantDocument[]) => void) => 
        DocumentQuery<GameServantDocument[], GameServantDocument>;

}

//#region Static function implementations

const findByCollectionNo = function (
    this: GameServantModel,
    collectionNo: number,
    callback?: (err: NativeError, res: GameServantDocument) => void
) {
    return this.findOne({ collectionNo }, callback);
};

const findByClass = function (
    this: GameServantModel,
    cls: GameServantClass,
    callback?: (err: NativeError, res: GameServantDocument[]) => void
) {
    return this.find({ class : cls }, callback);
};


//#endregion

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    findByCollectionNo,
    findByClass
};

/**
 * Mongoose schema for the `GameServant` type.
 */
const GameServantSchema = new Schema(GameServantSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(GameServantSchema.statics, Statics);

GameServantSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

// Add text index
// TODO Redo this
/*
GameServantSchema.index(
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

export const GameServantModel = mongoose.model<GameServantDocument, GameServantModel>('GameServant', GameServantSchema, 'GameServants');
