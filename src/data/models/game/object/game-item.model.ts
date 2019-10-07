import mongoose, { Document, Schema } from 'mongoose';
import GameItemCategories from '../../../types/game/object/game-item-category.type';
import { GameItem } from '../../../types/game/object/game-item.type';
import { GameObjectSchema } from '../../common-schema-definitions';

export type GameItemDocument = Document & GameItem;

const schema = new Schema({
    ...GameObjectSchema,
    rarity: {
        type: Number,
        min: 1,
        max: 3,
        required: true,
        default: 1
    },
    description: String,
    categories: {
        type: [String],
        enum: GameItemCategories()
    }
}, { timestamps: true });

export const GameItemModel = mongoose.model<GameItemDocument>('GameItem', schema, 'GameItems');