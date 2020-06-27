import { GameEvent } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';

export type GameEventDocument = Document & GameEvent;

const schema = new Schema({
    name: String,
    shortName: String,
    startDate: Date,
    endDate: Date,
    activities: [{}]
}, { timestamps: true });

export const GameEventModel = mongoose.model<GameEventDocument>('GameEvent', schema, 'GameEvents');