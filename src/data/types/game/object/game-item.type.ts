import { GameItemCategory, GamePlayerObject } from 'data/types';

/**
 * An in-game item owned by a player, including skill and ascention materials,
 * event items and currencies, and consumables.
 */
export type GameItem = GamePlayerObject & {
    description?: string;
    categories: GameItemCategory[];
}
