import { SchemaDefinition, Schema } from 'mongoose';
import { GameObjectSkillEffectValuesSchema } from './game-object-skill-effect-values.schema';
import { GameObjectSkillEffectSchemaDefinition } from './game-object-skill-effect.schema';
import { GameCharacterNoblePhantasmSchemaDefinition } from './game-character-noble-phantasm.schema';

/**
 * Mongoose schema for the `GameServantNoblePhantasm.effects` property.
 */
const GameServantNoblePhantasmEffectSchema = new Schema({
    ...GameObjectSkillEffectSchemaDefinition,
    values1: {
        type: [GameObjectSkillEffectValuesSchema],
        required: true,
        default: []
    },
    values2: {
        type: [GameObjectSkillEffectValuesSchema],
        required: true,
        default: []
    },
    values3: {
        type: [GameObjectSkillEffectValuesSchema],
        required: true,
        default: []
    },
    values4: {
        type: [GameObjectSkillEffectValuesSchema],
        required: true,
        default: []
    },
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameServantNoblePhantasm` type.
 */
export const GameServantNoblePhantasmSchemaDefinition: SchemaDefinition = {
    ...GameCharacterNoblePhantasmSchemaDefinition,
    effects: {
        type: [GameServantNoblePhantasmEffectSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameServantNoblePhantasm` type.
 */
export const GameServantNoblePhantasmSchema = new Schema(GameServantNoblePhantasmSchemaDefinition, { _id: false, storeSubdocValidationError: false });
