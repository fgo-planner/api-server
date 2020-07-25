import { ObjectId } from 'bson';
import { UserGameAccountSchemaDefinition } from 'data/schemas';
import { UserGameAccount } from 'data/types';
import { UserGameAccountValidators } from 'data/validators';
import mongoose, { Document, DocumentQuery, Model, NativeError, Schema } from 'mongoose';


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

    /**
     * Finds the game accounts associated with the given `userId`. Returns a
     * simplified version of the game account data.
     */
    findByUserId: (userId: ObjectId, callback?: (err: NativeError, res: UserGameAccountDocument[]) => void) =>
        DocumentQuery<UserGameAccountDocument[], UserGameAccountDocument>;

};

//#region Static function implementations

const findByUserId = function (
    this: UserGameAccountModel,
    userId: ObjectId,
    callback?: (err: NativeError, res: UserGameAccountDocument[]) => void
) {
    const projection = {
        name: 1,
        friendId: 1
    };
    return this.find({ userId }, projection, callback);
};

//#endregion

/**
 * Properties and functions that can be assigned as statics on the schema.
 */
const Statics = {
    isFriendIdFormatValid: UserGameAccountValidators.isFriendIdFormatValid,
    findByUserId
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