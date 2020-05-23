import { GameServant } from 'data/types';
import mongoose, { Document, Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { GameCharacterModel, GameCharacterSchemaDefinition } from './game-character.model';
import { GameObjectSchemaDefinition, GameObjectSchemaTextIndex } from './game-object.model';
import { GamePlayerObjectModel, GamePlayerObjectSchemaDefinition, Statics as GamePlayerObjectModelStatics } from './game-player-object.model';

export type GameServantDocument = Document & GameServant;

/**
 * Mongoose document model definition for the `GameItem` type.
 */
type GameServantModel = GamePlayerObjectModel<GameServantDocument> & GameCharacterModel<GameServantDocument>;

/**
 * Mongoose schema for the `GameServantUpgrade.materials` property.
 */
const GameServantUpgradeMaterialsSchema: Schema = new Schema({
    gameId: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 1
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameServantUpgrade` type.
 */
const GameServantUpgradeSchema: Schema = new Schema({
    cost: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        }
        // TODO Make this required? Add default value?
    },
    materials: {
        type: [GameServantUpgradeMaterialsSchema],
        required: true,
        default: []
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameServantSkill` type.
 */
const GameServantSkillSchema: Schema = new Schema({

}, { _id: false });

/**
 * Mongoose schema for the `GameServant.skills` property.
 */
const GameServantSkillsSchema: Schema = new Schema({
    skill1: {
        type: GameServantSkillSchema,
        required: true,
        default: {} // TODO Populate this.
    },
    skill2: {
        type: GameServantSkillSchema,
        required: true,
        default: {}
    },
    skill3: {
        type: GameServantSkillSchema,
        required: true,
        default: {}
    },
    upgrade1: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade2: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade3: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade4: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade5: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade6: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade7: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade8: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    },
    upgrade9: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameServantAscension` type.
 */
const GameServantAscensionSchema: Schema = new Schema({
    upgrade: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    }
}, { _id: false });

/**
 * Mongoose schema for the `GameServant.acensions` property.
 */
const GameServantAscensionsSchema: Schema = new Schema({
    ascension1: {
        type: GameServantAscensionSchema,
        required: true,
        default: {}
    },
    ascension2: {
        type: GameServantAscensionSchema,
        required: true,
        default: {}
    },
    ascension3: {
        type: GameServantAscensionSchema,
        required: true,
        default: {}
    },
    ascension4: {
        type: GameServantAscensionSchema,
        required: true,
        default: {}
    }
}, { _id: false });

/**
 * Mongoose schema definition for the `GameServant` model.
 */
const GameServantSchemaDefinition: SchemaDefinition = {
    ...GamePlayerObjectSchemaDefinition,
    ...GameCharacterSchemaDefinition,
    rarity: {
        ...GameObjectSchemaDefinition.rarity,
        min: 0 // Rarity for servants ranges from 0 thru 5.
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
        max: 16,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    skills: {
        type: GameServantSkillsSchema,
        required: true,
        default: {}
    },
    ascensions: {
        type: GameServantAscensionsSchema,
        required: true,
        default: {}
    }
};

/**
 * Mongoose schema for the `GameServant` model.
 */
const GameServantSchema = new Schema(GameServantSchemaDefinition, { timestamps: true });

// Add static functions for `GamePlayerObjectModel`.
Object.assign(GameServantSchema.statics, GamePlayerObjectModelStatics);

// Add text index
GameServantSchema.index(
    GameObjectSchemaTextIndex,
    {
        name: 'textIndex',
        weights: {
            urlPath: 5,
            name: 5,
            nameJp: 3,
        }
    }
);

export const GameServantModel = mongoose.model<GameServantDocument, GameServantModel>('GameServant', GameServantSchema, 'GameServants');