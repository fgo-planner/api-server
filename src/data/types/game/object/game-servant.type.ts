import { GameCharacter, GamePlayerObject } from 'data/types';

/**
 * A servant with an ID number (and thus viewable in My Room -> Spirit Origin
 * List), including any non-summonable, servants. Does not include non-playable
 * servants that don't have an ID number; such servants should be classified as
 * a GameEnemy instead.
 */
export type GameServant = GamePlayerObject & GameCharacter & {
    cost: number;
}
