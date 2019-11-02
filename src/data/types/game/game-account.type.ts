import { GameRegion } from 'data/types';
import { Entity } from 'internal';

export type GameAccount = Entity & {

    userId: string;

    gameAccountId: number;
    
    gameRegion: GameRegion;

    experience: number;

}
