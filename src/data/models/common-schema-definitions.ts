// Contains exports for common schema definitions that are shared by multiple models.

import { SchemaDefinition } from 'mongoose';
import GameRegions from '../types/game/game-region.type';
import { UrlStringUtils } from '../../utils/url-string.utils';

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
        enum: GameRegions(),
        required: true,
        default: ['JP']
    }
};