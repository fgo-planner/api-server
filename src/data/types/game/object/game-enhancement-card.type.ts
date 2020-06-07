import { GameCharacterClass } from './game-character-class.enum';
import { GameSpiritOrigin } from './game-spirit-origin.type';

/**
 * A servant enhancement card.
 * 
 * Examples:
 * - Fou cards
 * - Ember cards
 */
export type GameEnhancementCard = GameSpiritOrigin & {

    class: GameCharacterClass | 'All';

}
