import { Schema, SchemaDefinition } from 'mongoose';
import { GameCharacterNoblePhantasmSchemaDefinition } from './game-character-noble-phantasm.schema';
import { GameServantNoblePhantasmEffectSchema } from './game-servant-noble-phantasm-effect.schema';

/**
 * Mongoose schema definition for the `GameServantNoblePhantasm` type.
 */
export const GameServantNoblePhantasmSchemaDefinition: SchemaDefinition = {
    ...GameCharacterNoblePhantasmSchemaDefinition,
    // This overrides the `effects` property in `GameCharacterNoblePhantasmSchemaDefinition`.
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
