import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema definition for the `GameObjectSkillUnlockable` type.
 */
export const GameObjectSkillUnlockableSchemaDefinition: SchemaDefinition = {
    unlock: {
        type: {
            ascension: {
                type: Number,
                required: true,
                min: 0,
                max: 4,
                validate: {
                    validator: Number.isInteger,
                    message: MongooseValidationStrings.NumberInteger
                },
                default: 0
            },
            quest: {
                type: Boolean,
                required: true,
                default: false
            }
        }
    }
};
