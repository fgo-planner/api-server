import { SchemaDefinition, Schema } from 'mongoose';
import { MongooseValidationStrings } from 'strings';

/**
 * Mongoose schema for the `GameObject.metadata.links` objects.
 */
const GameObjectMetadataLinkSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    url: {
        type: String,
        required: true,
        // TODO Add validation
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameObject.metadata` property.
 */
export const GameObjectMetadataSchemaDefinition: SchemaDefinition = {
    // TODO Add urlPath field
    altNames: {
        type: [String],
        required: true,
        default: [],
        // TODO Index this?
    },
    tags: {
        type: [String],
        required: true,
        default: [],
        index: true
    },
    links: {
        type: [GameObjectMetadataLinkSchema],
        required: true,
        default: []
    }
};

/**
 * Mongoose schema for the `GameObject.metadata` property.
 */
const GameObjectMetadataSchema = new Schema(GameObjectMetadataSchemaDefinition, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameObject` base type.
 */
export const GameObjectSchemaDefinition: SchemaDefinition = {
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
    },
    displayName: {
        type: String,
        index: true
    },
    nameJp: {
        type: String
    },
    metadata: {
        type: GameObjectMetadataSchema,
        required: true,
        default: {}
    }
};

/**
 * Mongoose text index definition for the `GameObject` base type.
 */
// TODO Redo this
export const GameObjectSchemaTextIndex = {
    name: 'text',
    nameJp: 'text',
    urlPath: 'text'
};
