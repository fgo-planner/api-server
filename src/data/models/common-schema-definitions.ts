// Contains exports for common schema definitions that are shared by multiple models.

import GameRegions from '../types/game/game-region.type';

export const GameObjectSchema = {
    name: {
        type: String,
        required: true,
        index: true
    },
    nameJp: String,
    rarity: {
        type: Number,
        min: 0,
        max: 5,
        required: true,
        default: 1
    },
    gameRegions: {
        type: [String],
        enum: GameRegions()
    }
};