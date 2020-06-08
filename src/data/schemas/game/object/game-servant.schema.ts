import { GameServantDeck } from 'data/types';
import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { GameCharacterSchemaDefinition } from './game-character.schema';
import { GameServantUpgradeSchema } from './game-servant-upgrade.schema';
import { GameSpiritOriginCollectionSchemaDefinition } from './game-spirit-origin-collection.schema';
import { GameObjectSkillUnlockableSchemaDefinition } from './game-object-skill-unlockable.schema';
import { GameObjectSkillSchema, GameObjectSkillSchemaDefinition } from './game-object-skill.schema';
import { GameServantNoblePhantasmSchema, GameServantNoblePhantasmSchemaDefinition } from './game-servant-noble-phantasm.schema';

/**
 * Mongoose schema for the `GameServantUpgrade.cards.hits` property.
 */
const GameServantCardsHitsSchema = new Schema({
    buster: {
        type: [Number],
        required: true,
        // TODO Validate that all values are integers and that there is at least one
        // element and that all the elements add up to 100.
        default: [100]
    },
    arts: {
        type: [Number],
        required: true,
        // TODO Validate that all values are integers and that there is at least one
        // element and that all the elements add up to 100.
        default: [100]
    },
    quick: {
        type: [Number],
        required: true,
        // TODO Validate that all values are integers and that there is at least one
        // element and that all the elements add up to 100.
        default: [100]
    },
    extra: {
        type: [Number],
        required: true,
        // TODO Validate that all values are integers and that there is at least one
        // element and that all the elements add up to 100.
        default: [100]
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServantUpgrade.cards` property.
 */
const GameServantCardsSchema = new Schema({
    deck: {
        type: String,
        required: true,
        enum: Object.keys(GameServantDeck),
        default: GameServantDeck.BAAAQ
    },
    hits: {
        type: GameServantCardsHitsSchema,
        required: true,
        default: {}
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the intersection of the `GameObjectSkill` and
 * `GameObjectSkillUnlockable` types.
 */
const GameServantSkillUnlockableSchema = new Schema({
    ...GameObjectSkillSchemaDefinition,
    ...GameObjectSkillUnlockableSchemaDefinition
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.activeSkills.skill1` property. This
 * differs from `skill2` and `skill3` in that the the first skill base is
 * always unlocked.
 */
const GameCharacterActiveSkill1Schema = new Schema({
    base: {
        type: GameObjectSkillSchema,
        required: true,
        default: {} // TODO Populate this.
    },
    upgrade: {
        type: GameServantSkillUnlockableSchema
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.activeSkills.skill2` and 
 * `GameServant.activeSkills.skill3` properties. This differs from `skill1` in
 * that the second and third skills always have to be unlocked.
 */
const GameCharacterActiveSkill2And3Schema = new Schema({
    base: {
        type: GameServantSkillUnlockableSchema,
        required: true,
        default: {} // TODO Populate this.
    },
    upgrade: {
        type: GameServantSkillUnlockableSchema
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.activeSkills` property.
 */
const GameCharacterActiveSkillsSchema = new Schema({
    skill1: {
        type: GameCharacterActiveSkill1Schema,
        required: true,
        default: {}
    },
    skill2: {
        type: GameCharacterActiveSkill2And3Schema,
        required: true,
        default: {}
    },
    skill3: {
        type: GameCharacterActiveSkill2And3Schema,
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
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the intersection of the `GameServantNoblePhantasm` and
 * `GameObjectSkillUnlockable` types.
 */
const GameServantNoblePhantasmUnlockableSchema = new Schema({
    ...GameServantNoblePhantasmSchemaDefinition,
    ...GameObjectSkillUnlockableSchemaDefinition
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.noblePhantasm` property.
 */
const GameServantNoblePhantasmPropSchema = new Schema({
    base: {
        type: GameServantNoblePhantasmSchema,
        required: true,
        default: {} // TODO Populate this.
    },
    upgrade: {
        type: GameServantNoblePhantasmUnlockableSchema
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServantAscension` type.
 */
const GameServantAscensionSchema = new Schema({
    upgrade: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.ascensions` property.
 */
const GameServantAscensionsSchema = new Schema({
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
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.bond` property.
 */
const GameServantBondSchema = new Schema({
    max: {
        type: Number,
        required: true,
        min: 5,
        max: 10,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 5
    },
    points: {
        type: [Number],
        // TODO Validate that all values are integers.
        required: true
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema for the `GameServant.stats` property.
 */
const GameServantStatsSchema = new Schema({
    power: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    defense: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    agility: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    magic: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    luck: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    },
    noblePhantasm: {
        type: Number,
        required: true,
        min: 0,
        max: 99,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        default: 0
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameServant` model.
 */
export const GameServantSchemaDefinition: SchemaDefinition = {
    ...GameSpiritOriginCollectionSchemaDefinition,
    ...GameCharacterSchemaDefinition,
    // This overrides the `rarity` property in `GameSpiritOriginSchemaDefinition`.
    rarity: {
        ...GameSpiritOriginCollectionSchemaDefinition.rarity,
        min: 0 // Rarity for servants ranges from 0 thru 5.
    },
    summonable: {
        type: Boolean, 
        required: true,
        default: false
    },
    playable: {
        type: Boolean, 
        required: true,
        default: true
        // TODO Index this?
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
        default: 0,
        index: true
    },
    cards: {
        type: GameServantCardsSchema,
        required: true,
        default: {}
    },
    activeSkills: {
        type: GameCharacterActiveSkillsSchema
        // TODO Validate that this is present if the servant is marked as playable.
    },
    noblePhantasm: {
        type: GameServantNoblePhantasmPropSchema,
        required: true,
        default: {}
    },
    passiveSkills: {
        type: [GameObjectSkillSchema],
        required: true,
        default: [],
        _id: false
    },
    ascensions: {
        type: GameServantAscensionsSchema,
        required: true,
        default: {}
    },
    bond: {
        type: GameServantBondSchema,
        required: true,
        // TODO Validate that points.length match the max value
        default: {
            max: 5,
            points: [0, 0, 0, 0, 0]
        }
    },
    stats: {
        type: GameServantStatsSchema,
        required: true,
        default: {}
    }
};
