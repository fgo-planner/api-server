// Contains exports for common schema definitions that are shared by multiple models.

import { SchemaDefinition } from 'mongoose';
import GameRegions from '../types/game/game-region.type';

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
    },
    gameRegions: {
        type: [String],
        enum: GameRegions()
    }
};