import { ObjectId } from 'bson';
import { UserGameAccountValidators } from 'data/validators';
import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { UserGameAccountItemSchema } from './user-game-account-item.schema';
import { UserGameAccountServantSchema } from './user-game-account-servant.schema';

/**
 * Mongoose schema definition for the `UserGameAccount` type.
 */
export const UserGameAccountSchemaDefinition: SchemaDefinition = {
    userId: {
        type: ObjectId,
        required: true,
        index: true
    },
    name: {
        type: String,
        trim: true,
        maxlength: 31
    },
    friendId: {
        type: String,
        validate: {
            validator: UserGameAccountValidators.isFriendIdFormatValid,
            message: MongooseValidationStrings.UserGameAccountFriendIdFormat
        },
        index: true
    },
    exp: {
        type: Number,
        min: 0,
        max: 367421977, // TODO Define this as a constant
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: null
    },
    qp: {
        type: Number,
        required: true,
        min: 0,
        max: 999999999, // TODO Define this as a constant
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    items: {
        type: [UserGameAccountItemSchema],
        required: true,
        default: []
    },
    servants: {
        type: [UserGameAccountServantSchema],
        required: true,
        default: []
    }
};
