import { Schema } from 'mongoose';
import { GameServantUpgradeSchema } from './game-servant-upgrade.schema';

/**
 * Mongoose schema for the `GameServantAscension` type.
 */
export const GameServantAscensionSchema = new Schema({
    upgrade: {
        type: GameServantUpgradeSchema,
        required: true,
        default: {}
    }
}, { _id: false, storeSubdocValidationError: false });
