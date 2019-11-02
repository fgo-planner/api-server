import { ObjectID } from 'bson';
import { GameAccount } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';

export type GameAccountDocument = Document & GameAccount;

const schema = new Schema({
    userId: ObjectID,
    gameAccountId: { type: Number, min: 0, max: 999999999 },
    gameRegion: String,
    experience: Number
}, { timestamps: true });

schema.index({ userId: 1 });

export const GameAccountModel = mongoose.model<GameAccountDocument>('GameAccount', schema, 'GameAccounts');