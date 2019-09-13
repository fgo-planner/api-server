import mongoose, { Document, Model, NativeError, Schema } from 'mongoose';
import { User } from 'user.type';
import { ObjectID } from 'bson';

export type UserDocument = Document & User;

export interface UserModel extends Model<UserDocument> {
    updateActiveStatus: (id: string, status: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;
}

const userSchema = new Schema({
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, unique: true },
    active: Boolean
}, { timestamps: true });

userSchema.statics.updateActiveStatus = function(this: UserModel, id: string, status: boolean, callback: (err: any, doc: any) => void) {
    this.updateOne({ _id: new ObjectID(id)  }, { active : status }, callback);
};

export const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema);