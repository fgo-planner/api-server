import { GameServant, GameServantAttribute, GameServantClass } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { GameObjectSchema, GameObjectSchemaTextIndex } from '../../common-schema-definitions';

export type GameServantDocument = Document & GameServant;

const schemaDefinition: SchemaDefinition = {
    ...GameObjectSchema,
    rarity: {
        ...GameObjectSchema.rarity,
        min: 0 // Rarity for servants ranges from 0 thru 5.
    },
    gameId: {
        type: Number,
        required: true,
        unique: true
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
        max: 16,
        default: 0,
    },
    class: {
        type: String,
        enum: Object.keys(GameServantClass),
        required: true,
        default: GameServantClass.Shielder
    },
    attribute: {
        type: String,
        enum: Object.keys(GameServantAttribute),
        required: true,
        default: GameServantAttribute.Earth
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