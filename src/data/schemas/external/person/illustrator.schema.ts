import { SchemaDefinition } from 'mongoose';
import { PersonSchemaDefinition } from './person.schema';

/**
 * Mongoose schema definition for the `Illustrator` base type.
 */
export const IllustratorSchemaDefinition: SchemaDefinition = {
    ...PersonSchemaDefinition
};
