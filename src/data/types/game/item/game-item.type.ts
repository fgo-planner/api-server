import { Entity } from 'internal';
import { GameItemType } from './game-item-type.enum';
import { GameItemBackground } from './game-item-background.enum';

/**
 * An inventory item.
 * 
 * Examples:
 * - Servant upgrade materials
 * - Event items and currencies
 * - Other consumable items
 */
export type GameItem = Entity<number> & {

    name?: string;

    nameJp?: string;

    background: GameItemBackground;

    type: GameItemType;

}
