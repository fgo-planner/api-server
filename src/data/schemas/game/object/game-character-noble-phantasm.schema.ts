import { GameCharacterCardType, GameSkillRank } from 'data/types';
import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { GameObjectSkillEffectSchema } from './game-object-skill-effect.schema';

/**
 * Mongoose schema definition for the `GameCharacterNoblePhantasm` type.
 */
export const GameCharacterNoblePhantasmSchemaDefinition: SchemaDefinition = {
    skillId: {
        type: Number,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        required: true,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    nameJp: {
        type: String,
        // TODO Index this?
    },
    nameJpRuby: {
        type: String
    },
    rank: {
        type: String,
        enum: Object.keys(GameSkillRank)
    },
    rankUpper: {
        type: String,
        enum: Object.keys(GameSkillRank)
        // TODO Add mongoose middleware validation to ensure that if this is populated, then `rank` is also populated.
    },
    description: {
        type: String
    },
    descriptionJp: {
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
    },
    iconId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    },
    iconId2: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    effects: {
        type: [GameObjectSkillEffectSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameCharacterNoblePhantasm` type.
 */
export const GameCharacterNoblePhantasmSchema = new Schema(GameCharacterNoblePhantasmSchemaDefinition, { _id: false, storeSubdocValidationError: false });
