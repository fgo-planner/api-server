import { SchemaDefinition } from 'mongoose';
import { GameEventMaterialSourceSchema } from './game-event-material-source.schema';

/**
 * Mongoose schema definition for the `GameEvent` type.
 */
export const GameEventSchemaDefinition: SchemaDefinition = {
    name: {
        type: String,
        required: true,
    },
    shortName: {
        type: String
    },
    startDate: {
        type: Date,
        required: true,
        index: true
    },
    endDate: {
        type: Date,
        required: true,
        index: true
    },
    materialSource: {
        type: [GameEventMaterialSourceSchema],
        required: true,
        default: []
    }
};
