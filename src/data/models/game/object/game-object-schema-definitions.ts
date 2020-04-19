// Contains common schema definitions that are used by `GameObject` models.

import { GameCharacterAttribute, GameCharacterClass, GameRegion } from 'data/types';
import { SchemaDefinition } from 'mongoose';
import { UrlStringUtils } from 'utils';

export const GameRegionsSchema: SchemaDefinition = {
    [GameRegion.NA]: {
        type: Boolean,
        required: false
    },
    [GameRegion.JP]: {
        type: Boolean,
        required: true,
        default: true
    },
    [GameRegion.CN]: {
        type: Boolean,
        required: false
    },
    [GameRegion.KR]: {
        type: Boolean,
        required: false
    },
    [GameRegion.TW]: {
        type: Boolean,
        required: false
    }
};

export const GameObjectSchema: SchemaDefinition = {
    name: {
        type: String,
        required: true,
        index: true
    },
    nameJp: String,
    rarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 1,
        index: true
    }
};

export const GamePlayerObjectSchema: SchemaDefinition = {
    ...GameObjectSchema,
    urlString: {
        type: String,
        required: true,
        unique: true,
        validate: [
            UrlStringUtils.isValid,
            'Invalid URL string format.'
        ]
    },
    gameId: {
        type: Number,
        required: true,
        unique: true
    },
    gameRegions: {
        type: GameRegionsSchema,
        required: true,
        default: {
            [GameRegion.JP]: true
        }
    }
};

export const GameCharacterSchema: SchemaDefinition = {
    ...GameObjectSchema,
    class: {
        type: String,
        enum: Object.keys(GameCharacterClass),
        required: true,
        default: GameCharacterClass.Shielder
    },
    attribute: {
        type: String,
        enum: Object.keys(GameCharacterAttribute),
        required: true,
        default: GameCharacterAttribute.Earth
    }
};

export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlString: 'text'
};