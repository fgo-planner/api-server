import { ObjectId } from 'bson';
import { GameAccount, GameAccountServantSkill, GameRegion } from 'data/types';
import mongoose, { Document, Model, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';


export type GameAccountDocument = Document & GameAccount;

/**
 * Mongoose document model for the `GameAccount` type.
 */
export interface GameAccountModel extends Model<GameAccountDocument> {

    /**
     * Checks if the given game account ID string is in a valid format. Game
     * account IDs must be exactly 9 characters long and can only contain numerical
     * digits.
     */
    isAccountIdFormatValid: (id: string) => boolean;

}

/**
 * Regex for checking if a game account ID string is in a valid format. Game
 * account IDs must be exactly 9 characters long and can only contain numerical
 * digits.
 */
const AccountIdFormatValidationRegex = new RegExp(/^\d{9}$/);

/**
 * Validator function that tests the account ID format validation RegExp
 * against the given game account ID string to check if it's in a valid format.
 */
const isAccountIdFormatValid = (id: string) => {
    return AccountIdFormatValidationRegex.test(id);
};

/**
 * Validator function that checks if a servant's skill is unlocked. 
 */
const isSkillUnlocked = (skill: GameAccountServantSkill) => {
    return !!skill.unlocked;
};

/**
 * Validator function that checks if a servant's fou upgrade value is valid. If
 * the value is less than or equal to 1000, the value must be a multiple of 10.
 * Otherwise, the value must be a multiple of 20.
 */
const isFouValueValid = (value: number) => {
    if (value <= 1000) {
        return value % 10 === 0;
    }
    return value % 20 === 0;
};

/**
 * Mongoose schema for the GameAccountServantSkill type.
 */
const GameAccountServantSkillSchema: Schema = new Schema({
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    },
    unlocked: {
        type: Boolean,
        required: true,
        default: false
    },
    upgraded: {
        type: Boolean,
        required: true,
        default: false
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameAccountServantNoblePhantasm` type.
 */
const GameAccountServantNoblePhantasmSchema: Schema = new Schema({
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    },
    upgraded: {
        type: Boolean,
        required: true,
        default: false
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameAccountServant` type.
 */
const GameAccountServantSchema: Schema = new Schema({
    gameId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    dateAcquired: {
        type: Date
        // TODO Add range validation
    },
    level: {
        type: Number,
        required: true,
        min: 1,
        max: 100,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    },
    bond: {
        type: Number,
        min: 1,
        max: 15,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: null
    },
    fouAttack: {
        type: Number,
        min: 0,
        max: 2000,
        validate: {
            validator: isFouValueValid,
            message: MongooseValidationStrings.GenericInvalidValue
        },
        default: null
    },
    fouHealth: {
        type: Number,
        min: 0,
        max: 2000,
        validate: {
            validator: isFouValueValid,
            message: MongooseValidationStrings.GenericInvalidValue
        },
        default: null
    },
    skill1: {
        type: GameAccountServantSkillSchema,
        required: true,
        validate: {
            // First skill must always be unlocked.
            validator: isSkillUnlocked, 
            message: MongooseValidationStrings.GameAccountServantFirstSkillUnlocked
        },
        default: { 
            level: 1,
            unlocked: true,
            upgraded: false
        }
    },
    skill2:  {
        type: GameAccountServantSkillSchema,
        required: true,
        default: { 
            level: 1,
            unlocked: false,
            upgraded: false
        }
    },
    skill3: {
        type: GameAccountServantSkillSchema,
        required: true,
        default: { 
            level: 1,
            unlocked: false,
            upgraded: false
        }
    },
    noblePhantasm: {
        type: GameAccountServantNoblePhantasmSchema,
        required: true,
        default: {
            level: 1,
            upgraded: false
        }
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameAccountItem` type.
 */
const GameAccountItemSchema: Schema = new Schema({
    gameId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    }
}, { _id: false });

/**
 * Mongoose schema definition for the `GameAccount` model.
 */
const GameAccountSchemaDefinition: SchemaDefinition = {
    userId: {
        type: ObjectId,
        required: true,
        index: true
    },
    gameAccountId: {
        type: String,
        required: true,
        validate: {
            validator: isAccountIdFormatValid,
            message: MongooseValidationStrings.GameAccountIdFormat
        },
        index: true
        // TODO Make unique?
    },
    gameRegion: {
        type: String,
        enum: Object.keys(GameRegion),
        required: true,
        default: GameRegion.NA,
        index: true
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
        type: [GameAccountItemSchema],
        required: true,
        default: []
    },
    servants: {
        type: [GameAccountServantSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameAccount` model.
 */
const GameAccountSchema = new Schema(GameAccountSchemaDefinition, { timestamps: true });

GameAccountSchema.statics.isAccountIdFormatValid = isAccountIdFormatValid;

export const GameAccountModel = mongoose.model<GameAccountDocument, GameAccountModel>('GameAccount', GameAccountSchema, 'GameAccounts');