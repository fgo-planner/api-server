import { GameRegion } from '../game-region.enum';
import { GameObject } from './game-object.type';

/**
 * Base type that represents in-game objects whose availability are limited to
 * specific game regions (servers).
 */
export type GameObjectRegional = GameObject & {

    gameRegions: { [key in GameRegion]?: boolean };

}
