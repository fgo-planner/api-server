import { CharacterVoiceSchemaDefinition } from 'data/schemas';
import { CharacterVoice } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';
import { PersonModel } from './person.model';

export type CharacterVoiceDocument = Document & CharacterVoice;

/**
 * Mongoose document model definition for the `CharacterVoice` type.
 */
type CharacterVoiceModel = PersonModel<CharacterVoiceDocument>;

/**
 * Mongoose schema for the `CharacterVoice` type.
 */
const CharacterVoiceSchema = new Schema(CharacterVoiceSchemaDefinition, { timestamps: true });

CharacterVoiceSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const CharacterVoiceModel = mongoose.model<CharacterVoiceDocument, CharacterVoiceModel>('CharacterVoice', CharacterVoiceSchema, 'CharacterVoices');
