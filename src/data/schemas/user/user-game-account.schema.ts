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
    friendId: {
        type: String,
        required: true,
        validate: {
            validator: UserGameAccountValidators.isFriendIdFormatValid,
            message: MongooseValidationStrings.UserGameAccountFriendIdFormat
        },
        index: true
        // TODO Make unique?
    },
    experience: {
        type: Number,
        min: 0,
        max: 367421977, // TODO Define this as a constant
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: null
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
