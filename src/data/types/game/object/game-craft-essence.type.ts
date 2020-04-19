import { GamePlayerObject } from 'data/types';

/**
 * A craft essence.
 */
export type GameCraftEssence = GamePlayerObject & {
    cost: number;
    // effects: string[];
}
