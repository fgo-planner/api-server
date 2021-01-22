import { ObjectId } from 'bson';
import { MasterAccountValidators } from 'data/validators';
import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { MasterItemSchema } from './master-item.schema';
import { MasterServantSchema } from './master-servant.schema';

/**
 * Mongoose schema definition for the `MasterAccount` type.
 */
export const MasterAccountSchemaDefinition: SchemaDefinition = {
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
            validator: MasterAccountValidators.isFriendIdFormalValidOrEmpty,
            message: MongooseValidationStrings.MasterFriendIdFormat
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
        type: [MasterItemSchema],
        required: true,
        default: []
    },
    servants: {
        type: [MasterServantSchema],
        required: true,
        default: []
    }
};
