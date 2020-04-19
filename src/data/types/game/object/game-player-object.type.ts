import { GameObject, GameRegion } from 'data/types';

/**
 * Base type that represents in-game objects available to the player, such as
 * servants, craft essences, and materials.
 */
export type GamePlayerObject = GameObject & {
    urlString: string;
    gameId: number;
    gameRegions: { [key in GameRegion]?: boolean };
}