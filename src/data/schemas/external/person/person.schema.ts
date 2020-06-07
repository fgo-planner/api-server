import { SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { ExternalLinkSchema } from '../external-link.schema';

/**
 * Mongoose schema definition for the `Person` base type.
 */
export const PersonSchemaDefinition: SchemaDefinition = {
    _id: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        }
    },
    name: {
        type: String
        // TODO Index this
    },
    nameJp: {
        type: String
    },
    links: {
        type: [ExternalLinkSchema],
        required: true,
        default: []
    }
};
