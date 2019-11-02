import { GameEvent, GameRegion } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';

export type GameEventDocument = Document & GameEvent;

const schema = new Schema({
    name: String,
    gameRegion: {
        type: String,
        enum: Object.keys(GameRegion),
        required: true
    },
    shortName: String,
    startDate: Date,
    endDate: Date,
    activities: [{}]
}, { timestamps: true });

export const GameEventModel = mongoose.model<GameEventDocument>('GameEvent', schema, 'GameEvents');