import { Schema } from 'mongoose';
import { GameObjectSkillEffectValuesSchema } from './game-object-skill-effect-values.schema';
import { GameObjectSkillEffectSchemaDefinition } from './game-object-skill-effect.schema';

/**
 * Mongoose schema for the `GameServantNoblePhantasm.effects` property.
 */
export const GameServantNoblePhantasmEffectSchema = new Schema({
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
