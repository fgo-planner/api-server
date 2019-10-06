import mongoose, { Document, Schema } from 'mongoose';
import { GameAccount } from '../../types/game/game-account.type';
import { ObjectID } from 'bson';

export type GameAccountDocument = Document & GameAccount;

const schema = new Schema({
    userId: ObjectID,
    gameAccountId: { type: Number, min: 0, max: 999999999 },
    gameRegion: String,
    experience: Number
}, { timestamps: true });

schema.index({ userId: 1 });

export const GameAccountModel = mongoose.model<GameAccountDocument>('GameAccount', schema, 'GameAccounts');