// Contains exports for common schema definitions that are shared by multiple models.

import { GameRegion } from 'data/types';
import { SchemaDefinition } from 'mongoose';
import { UrlStringUtils } from 'utils';

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
    gameRegions: {
        type: [String],
        enum: Object.keys(GameRegion),
        required: true,
        default: ['JP']
    }
};

export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlString: 'text'
};