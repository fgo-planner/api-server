import { Schema, SchemaDefinition } from 'mongoose';
import { MongooseValidationStrings } from 'strings';
import { NumberUtils } from 'utils';
import { GameObjectMetadataSchemaDefinition } from './game-object.schema';
import { GameSpiritOriginSchemaDefinition } from './game-spirit-origin.schema';

/**
 * Mongoose schema for the `GameSpiritOriginCollection.metadata` property.
 */
const GameSpiritOriginCollectionMetadataSchema = new Schema({
    ...GameObjectMetadataSchemaDefinition,
    illustratorId: {
        type: Number,
        min: 0,
        validate: {
            validator: NumberUtils.isNullOrInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        index: true
    }
}, { _id: false, storeSubdocValidationError: false });

/**
 * Mongoose schema definition for the `GameSpiritOriginCollection` base type.
 */
export const GameSpiritOriginCollectionSchemaDefinition: SchemaDefinition = {
    ...GameSpiritOriginSchemaDefinition,
    collectionNo: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: MongooseValidationStrings.NumberInteger
        },
        unique: true
    },
    // This overrides the `metadata` property in `GameObjectSchemaDefinition`.
    metadata: {
        type: GameSpiritOriginCollectionMetadataSchema,
        required: true,
        default: {}
    }
};
