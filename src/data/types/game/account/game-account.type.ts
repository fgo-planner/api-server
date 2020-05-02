import { GameAccountItem, GameAccountServant, GameRegion } from 'data/types';
import { Entity } from 'internal';

export type GameAccount = Entity & {

    userId: string;

    gameAccountId: string;

    gameRegion: GameRegion;

    experience: number;

    items: GameAccountItem[];

    servants: GameAccountServant[];

}
