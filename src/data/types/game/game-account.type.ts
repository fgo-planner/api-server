import { Entity } from '../../../internal/types/entity.type';
import { GameRegion } from './game-region.type';

export type GameAccount = Entity & {

    userId: string;

    gameAccountId: number;
    
    gameRegion: GameRegion;

    experience: number;

}
