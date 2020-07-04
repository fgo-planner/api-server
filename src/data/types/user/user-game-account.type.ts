import { ObjectId } from 'bson';
import { Entity } from '../entity.type';
import { UserGameAccountItem } from './user-game-account-item.type';
import { UserGameAccountServant } from './user-game-account-servant.type';

export type UserGameAccount = Entity<ObjectId> & {

    userId: ObjectId;

    friendId: string;

    experience: number;

    items: UserGameAccountItem[];

    servants: UserGameAccountServant[];

}
