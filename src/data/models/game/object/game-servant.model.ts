import { GameServantSchemaDefinition } from 'data/schemas';
import { GameServant } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';
import { GameCharacterModel, Statics as GameCharacterStatics, SortProperties as GameCharacterSortProperties } from './game-character.model';
import { GameSpiritOriginCollectionModel, Statics as GameSpiritOriginCollectionStatics, SortProperties as GameSpiritOriginCollectionSortProperties } from './game-spirit-origin-collection.model';

export type GameServantDocument = Document & GameServant;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameServantModel = GameSpiritOriginCollectionModel<GameServantDocument> & GameCharacterModel<GameServantDocument>;

/**
 * Properties that can be used as sort keys.
 */
const SortProperties = [
    ...GameSpiritOriginCollectionSortProperties,
    ...GameCharacterSortProperties,
    'cards.deck',
    'noblePhantasm.base.cardType',
    'stats.power',
    'stats.defense',
    'stats.agility',
    'stats.magic',
    'stats.luck',
    'stats.noblePhantasm'
];

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    ...GameSpiritOriginCollectionStatics,
    ...GameCharacterStatics,
    SortProperties
};

/**
 * Mongoose schema for the `GameServant` model.
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