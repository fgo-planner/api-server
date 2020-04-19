import { GameServant } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameCharacterSchema, GameObjectSchema, GameObjectSchemaTextIndex, GamePlayerObjectSchema } from '../../common-schema-definitions';

export type GameServantDocument = Document & GameServant;

const schemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchema,
    ...GameCharacterSchema,
    rarity: {
        ...GameObjectSchema.rarity,
        min: 0 // Rarity for servants ranges from 0 thru 5.
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
        max: 16,
        default: 0,
    }
};

const schema = new Schema(schemaDefinition, { timestamps: true });

// Add text index
schema.index(
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

export const GameServantModel = mongoose.model<GameServantDocument>('GameServant', schema, 'GameServants');