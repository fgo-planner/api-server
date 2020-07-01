import { UserGameAccountSchemaDefinition } from 'data/schemas';
import { UserGameAccount } from 'data/types';
import { UserGameAccountValidators } from 'data/validators';
import mongoose, { Document, Model, Schema } from 'mongoose';

export type UserGameAccountDocument = Document & UserGameAccount;

/**
 * Mongoose document model definition for the `UserGameAccount` type.
 */
type UserGameAccountModel = Model<UserGameAccountDocument> & {

    /**
     * Checks if the given game account ID string is in a valid format. Game
     * account IDs must be exactly 9 characters long and can only contain numerical
     * digits.
     */
    isFriendIdFormatValid: (id: string) => boolean;

};

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    isFriendIdFormatValid: UserGameAccountValidators.isFriendIdFormatValid
};

/**
 * Mongoose schema for the `UserGameAccount` type.
 */
const UserGameAccountSchema = new Schema(UserGameAccountSchemaDefinition, { timestamps: true });

// Add the static properties to the schema.
Object.assign(UserGameAccountSchema.statics, Statics);

UserGameAccountSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const UserGameAccountModel = mongoose.model<UserGameAccountDocument, UserGameAccountModel>('UserGameAccount', UserGameAccountSchema, 'UserGameAccounts');