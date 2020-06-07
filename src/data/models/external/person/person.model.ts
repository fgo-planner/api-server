import { Person } from 'data/types';
import { Document, Model } from 'mongoose';

/**
 * Mongoose document data model definition for the `Person` base type.
 */
export type PersonModel<T extends Person & Document> = Model<T>;