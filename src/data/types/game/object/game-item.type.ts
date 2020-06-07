import { GameItemType } from './game-item-type.enum';
import { GameObjectRegional } from './game-object-regional.type';

/**
 * An inventory item.
 * 
 * Examples:
 * - Servant upgrade materials
 * - Event items and currencies
 * - Other consumable items
 */
export type GameItem = GameObjectRegional & {

    rarity: number;

    description?: string;

    categories: GameItemType[];

}
