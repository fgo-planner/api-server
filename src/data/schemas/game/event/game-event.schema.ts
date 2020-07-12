import { SchemaDefinition } from 'mongoose';
import { GameEventRewardSourceSchema } from './game-event-reward-source.schema';
import { truncate } from 'fs';

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
    rerun:  {
        type: Boolean,
        required: true, 
        index: true,
        default: false
    },
    rewardSources: {
        type: [GameEventRewardSourceSchema],
        required: true,
        default: []
    }
};
