import { GameRegion } from 'game/game-region.type';
import { Entity } from '../../../../internal/types/entity.type';

export type GameObject = Entity & {
    name: string;
    nameJp?: string;
    urlString: string;
    rarity: number;
    gameRegions: GameRegion[];
}
