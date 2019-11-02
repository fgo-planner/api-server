import { GameRegion } from 'game/game-region.type';
import { Entity } from '../../../../internal';

export type GameObject = Entity & {
    name: string;
    nameJp?: string;
    urlString: string;
    rarity: number;
    gameRegions: GameRegion[];
}
