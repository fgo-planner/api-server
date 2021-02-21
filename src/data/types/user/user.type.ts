import { ObjectId } from 'bson';
import { Entity } from '../entity.type';

export type User = Entity<ObjectId> & {

    username: string;

    hash?: string;

    email?: string;

    admin?: boolean;

    enabled: boolean;
    
};
