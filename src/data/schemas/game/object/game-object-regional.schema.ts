import { GameRegion } from 'data/types';
import { Schema, SchemaDefinition } from 'mongoose';
import { GameObjectSchemaDefinition } from './game-object.schema';

/**
 * Mongoose schema for the `GameObjectRegionalModel.gameRegions` property.
 */
const GameRegionsSchema = new Schema({
    [GameRegion.NA]: {
        type: Boolean,
        required: false
    },
    [GameRegion.JP]: {
        type: Boolean,
        required: true,
        // TODO Validate that this value is always true.
        default: true
    },
    [GameRegion.CN]: {
        type: Boolean,
        required: false
    },
    [GameRegion.KR]: {
        type: Boolean,
        required: false
    },
    [GameRegion.TW]: {
        type: Boolean,
        required: false
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameObject` base type.
 */
export const GameObjectRegionalSchemaDefinition: SchemaDefinition = {
    ...GameObjectSchemaDefinition,
    gameRegions: {
        type: GameRegionsSchema,
        required: true,
        default: {
            [GameRegion.JP]: true
        }
    }
};
