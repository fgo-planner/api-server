import { GameObjectRegional } from './game-object-regional.type';

/**
 * Base type that represents a spirit origin. Spirit origins are entities that
 * can be summoned by masters in-game. 
 * 
 * Examples:
 * - Servants
 * - Craft essences
 * - Servant enhancement cards (Ember and Fou cards)
 * - Command codes
 */
export type GameSpiritOrigin = GameObjectRegional & {

    rarity: number;

    nameJpRuby?: string;

    sell: {

        qp: number;

        manaPrisms: number;

        rarePrisms: number;

    };

}
