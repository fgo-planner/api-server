import { User } from 'data/types';
import mongoose, { Document, Model, NativeError, Schema, SchemaDefinition } from 'mongoose';

export type UserDocument = Document & User;

type UserModel = Model<UserDocument> & {
    setActiveStatus: (id: string, status: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;
    setAdminStatus: (id: string, isAdmin: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;
};

const UserSchemaDefinition: SchemaDefinition = {
    username: { type: String, unique: true },
    hash: String,
    email: { type: String, unique: true },
    admin: Boolean,
    active: Boolean
};

const UserSchema = new Schema(UserSchemaDefinition, { timestamps: true });

UserSchema.statics.setActiveStatus = function (
    this: UserModel,
    id: string,
    status: boolean,
    callback: (err: NativeError, doc: UserDocument) => void
) {
    this.updateOne({ _id: id }, { active: status }, callback);
};

UserSchema.statics.setAdminStatus = function (this: UserModel,
    id: string,
    isAdmin: boolean,
    callback: (err: NativeError, doc: UserDocument) => void
) {
    const update: any = {};
    if (isAdmin) {
        update.$set = { admin: true };
    } else {
        update.$unset = { admin: null };
    }
    this.updateOne({ _id: id }, update, callback);
};

export const UserModel = mongoose.model<UserDocument, UserModel>('User', UserSchema, 'Users');