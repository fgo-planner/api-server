import { GameObject, GameCharacterAttribute, GameCharacterClass } from 'data/types';

/**
 * Base class that represents in-game characters, such as servants and NPC
 * enemies.
 */
export type GameCharacter = GameObject & {
    class: GameCharacterClass;
    attribute: GameCharacterAttribute;
}