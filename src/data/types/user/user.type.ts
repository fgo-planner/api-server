import { ObjectId } from 'bson';
import { Entity } from 'internal';

export type User = Entity<ObjectId> & {
    username: string;
    hash?: string;
    email?: string;
    admin?: boolean;
    active?: boolean;
}
