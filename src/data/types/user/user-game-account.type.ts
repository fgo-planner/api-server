import { ObjectId } from 'bson';
import { UserGameAccountItem, UserGameAccountServant } from 'data/types';
import { Entity } from '../entity.type';

export type UserGameAccount = Entity<ObjectId> & {

    userId: ObjectId;

    friendId: string;

    experience: number;

    items: UserGameAccountItem[];

    servants: UserGameAccountServant[];

}
