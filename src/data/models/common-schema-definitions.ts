// Contains exports for common schema definitions that are shared by multiple models.

import { SchemaDefinition } from 'mongoose';
import { UrlStringUtils } from 'utils';
import { GameRegion } from 'data/types';

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
    urlString: {
        type: String,
        required: true,
        unique: true,
        validate: [
            UrlStringUtils.isValid,
            'Invalid URL string format.'
        ]
    },
    rarity: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        default: 1,
        index: true
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

export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlString: 'text'
};