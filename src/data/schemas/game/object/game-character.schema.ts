import { GameCharacterAlignment, GameCharacterAttribute, GameCharacterClass, GameCharacterGender, GameCharacterTrait } from 'data/types';
import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { GameObjectMetadataSchemaDefinition, GameObjectSchemaDefinition } from './game-object.schema';

/**
 * Mongoose schema definition for the `GameCharacter.metadata` property.
 */
const GameCharacterMetadataSchemaDefinition: SchemaDefinition = {
    ...GameObjectMetadataSchemaDefinition,
    illustratorId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    },
    cvId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    }
};

/**
 * Mongoose schema for the `GameCharacter.metadata` property.
 */
const GameCharacterMetadataSchema = new Schema(GameCharacterMetadataSchemaDefinition, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameCharacter` base type.
 */
export const GameCharacterSchemaDefinition: SchemaDefinition = {
    ...GameObjectSchemaDefinition,
    battleName: {
        type: String
    },
    battleNameJp: {
        type: String
    },
    class: {
        type: String,
        enum: Object.keys(GameCharacterClass),
        required: true,
        default: GameCharacterClass.Shielder,
        index: true
    },
    attribute: {
        type: String,
        enum: Object.keys(GameCharacterAttribute),
        required: true,
        default: GameCharacterAttribute.Earth,
        index: true
    },
    alignment: {
        type: [String],
        enum: Object.keys(GameCharacterAlignment),
        required: true,
        default: [
            GameCharacterAlignment.Lawful,
            GameCharacterAlignment.Good
        ]
        // TODO Validate this to have at least two values.
        // TODO Index this
    },
    traits: {
        type: [String],
        enum: Object.keys(GameCharacterTrait),
        required: true,
        default: [],
        index: true
    },
    gender: {
        type: String,
        enum: Object.keys(GameCharacterGender),
        required: true,
        default: GameCharacterGender.Female,
        index: true
    },
    hpBase: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    hpMax: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    atkBase: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    atkMax: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    starRate: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    deathRate: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    criticalWeight: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0,
        index: true
    },
    // This overrides the `metadata` property in `GameObjectSchemaDefinition`.
    metadata: {
        type: GameCharacterMetadataSchema,
        required: true,
        default: {}
    }
};
