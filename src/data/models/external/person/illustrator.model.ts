import { IllustratorSchemaDefinition } from 'data/schemas';
import { Illustrator } from 'data/types';
import mongoose, { Document, Schema } from 'mongoose';
import { PersonModel } from './person.model';

export type IllustratorDocument = Document & Illustrator;

/**
 * Mongoose document model definition for the `Illustrator` type.
 */
type IllustratorModel = PersonModel<IllustratorDocument>;

/**
 * Mongoose schema for the `Illustrator` type.
 */
const IllustratorSchema = new Schema(IllustratorSchemaDefinition, { timestamps: true });

IllustratorSchema.set('toJSON', {
    // virtuals: true,
    versionKey: false,
});

export const IllustratorModel = mongoose.model<IllustratorDocument, IllustratorModel>('Illustrator', IllustratorSchema, 'Illustrators');
