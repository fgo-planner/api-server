import { ObjectId } from 'bson';
import { GameAccountItem, GameAccountServant } from 'data/types';
import { Entity } from '../../entity.type';

export type GameAccount = Entity<ObjectId> & {

    userId: string;

    gameAccountId: string;

    experience: number;

    items: GameAccountItem[];

    servants: GameAccountServant[];

}
