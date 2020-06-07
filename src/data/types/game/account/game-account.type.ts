import { ObjectId } from 'bson';
import { GameAccountItem, GameAccountServant, GameRegion } from 'data/types';
import { Entity } from 'internal';

export type GameAccount = Entity<ObjectId> & {

    userId: string;

    gameAccountId: string;

    gameRegion: GameRegion;

    experience: number;

    items: GameAccountItem[];

    servants: GameAccountServant[];

}
