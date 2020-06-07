import { GameCharacterCardType } from 'data/types';
import { Schema, SchemaDefinition } from 'mongoose';
import { GameObjectSkillSchemaDefinition } from './game-object-skill.schema';

/**
 * Mongoose schema definition for the `GameCharacterNoblePhantasm` type.
 */
export const GameCharacterNoblePhantasmSchemaDefinition: SchemaDefinition = {
    ...GameObjectSkillSchemaDefinition,
    nameJpRuby: {
        type: String
    },
    classification: {
        type: String,
        index: true
    },
    classificationJp: {
        type: String
        // TODO Index this ?
    },
    cardType: {
        type: String,
        enum: Object.keys(GameCharacterCardType),
        required: true,
        default: GameCharacterCardType.Arts,
        index: true
    },
    hits: {
        type: [Number],
        required: true,
        // TODO Validate that all values are integers and that there is at least one
        // element and that all the elements add up to 100.
        default: [100]
    }
};

/**
 * Mongoose schema for the `GameCharacterNoblePhantasm` type.
 */
export const GameCharacterNoblePhantasmSchema = new Schema(GameCharacterNoblePhantasmSchemaDefinition, { _id: false, storeSubdocValidationError: false });
