import { GameRegion } from 'data/types';
import { Entity } from 'internal';

export type GameObject = Entity & {
    name: string;
    nameJp?: string;
    urlString: string;
    rarity: number;
    gameRegions: { [key in GameRegion]?: boolean };
}
