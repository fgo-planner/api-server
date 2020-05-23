import { GameObject, GameRegion } from 'data/types';

/**
 * Base type that represents in-game objects available to the player, such as
 * servants, craft essences, and materials.
 */
export type GamePlayerObject = GameObject & {
    gameId: number;
    urlPath: string;
    gameRegions: { [key in GameRegion]?: boolean };
}