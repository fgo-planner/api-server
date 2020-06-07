import { SchemaDefinition } from 'mongoose';
import { PersonSchemaDefinition } from './person.schema';

/**
 * Mongoose schema definition for the `CharacterVoice` base type.
 */
export const CharacterVoiceSchemaDefinition: SchemaDefinition = {
    ...PersonSchemaDefinition
};
