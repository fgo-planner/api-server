import { Entity } from '../../../internal';
import { GameRegion } from 'game/game-region.type';

export type GameAccount = Entity & {

    userId: string;

    gameAccountId: number;
    
    gameRegion: GameRegion;

    experience: number;

}
