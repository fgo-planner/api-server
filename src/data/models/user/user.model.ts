import { User } from 'data/types';
import mongoose, { Document, Model, NativeError, Schema, SchemaDefinition } from 'mongoose';

export type UserDocument = Document & User;

export interface UserModel extends Model<UserDocument> {
    setActiveStatus: (id: string, status: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;
    setAdminStatus: (id: string, isAdmin: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;
}

const schemaDefinition: SchemaDefinition = {
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, unique: true },
    admin: Boolean,
    active: Boolean
};

const userSchema = new Schema(schemaDefinition, { timestamps: true });

userSchema.statics.setActiveStatus = function(this: UserModel, id: string, status: boolean, callback: (err: any, doc: any) => void) {
    this.updateOne({ _id: id }, { active : status }, callback);
};

userSchema.statics.setAdminStatus = function(this: UserModel, id: string, isAdmin: boolean, callback: (err: any, doc: any) => void) {
    const update: any = {};
    if (isAdmin) {
        update.$set = { admin: true };
    } else {
        update.$unset = { admin: null };
    }
    this.updateOne({ _id: id }, update, callback);
};

export const UserModel = mongoose.model<UserDocument, UserModel>('User', userSchema, 'Users');