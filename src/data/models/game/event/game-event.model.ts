import mongoose, { Document, Schema } from 'mongoose';
import { GameEvent } from '../../../types/game/event/game-event.type';
import GameRegions from '../../../types/game/game-region.type';

export type GameEventDocument = Document & GameEvent;

const schema = new Schema({
    name: String,
    gameRegion: {
        type: String,
        enum: GameRegions(),
        required: true
    },
    shortName: String,
    startDate: Date,
    endDate: Date,
    activities: [{}]
}, { timestamps: true });

export const GameEventModel = mongoose.model<GameEventDocument>('GameEvent', schema, 'GameEvents');