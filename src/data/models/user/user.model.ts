import { UserSchemaDefinition } from 'data/schemas';
import { User } from 'data/types';
import mongoose, { Document, Model, NativeError, Schema } from 'mongoose';

export type UserDocument = Document & User;

type UserModel = Model<UserDocument> & {

    setEnabledStatus: (id: string, status: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;

    setAdminStatus: (id: string, isAdmin: boolean, callback: (err: NativeError, doc: UserDocument) => void) => void;

};

//#region Static function implementations

const setEnabledStatus = function (
    this: UserModel,
    id: string,
    status: boolean,
    callback: (err: NativeError, doc: UserDocument) => void
) {
    this.updateOne({ _id: id }, { active: status }, { new: true }, callback);
};

const setAdminStatus = function (this: UserModel,
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
    this.updateOne({ _id: id }, update, { new: true }, callback);
};

//#endregion

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    setEnabledStatus,
    setAdminStatus
};

/**
 * Mongoose schema for the `User` type.
 */
const UserSchema = new Schema(UserSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(UserSchema.statics, Statics);

UserSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const UserModel = mongoose.model<UserDocument, UserModel>('User', UserSchema, 'Users');