import { GameServant } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameCharacterSchemaDefinition, GameObjectSchemaDefinition, GameObjectSchemaTextIndex, GamePlayerObjectSchemaDefinition } from './game-object-schema-definitions';

export type GameServantDocument = Document & GameServant;

/**
 * Mongoose schema definition for the `GameServant` model.
 */
const GameServantSchemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchemaDefinition,
    ...GameCharacterSchemaDefinition,
    rarity: {
        ...GameObjectSchemaDefinition.rarity,
        min: 0 // Rarity for servants ranges from 0 thru 5.
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
        max: 16,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    }
};

/**
 * Mongoose schema for the `GameServant` model.
 */
const GameServantSchema = new Schema(GameServantSchemaDefinition, { timestamps: true });

// Add text index
GameServantSchema.index(
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

export const GameServantModel = mongoose.model<GameServantDocument>('GameServant', GameServantSchema, 'GameServants');