import { GameCharacterNoblePhantasm } from './game-character-noble-phantasm.type';
import { GameCharacter } from './game-character.type';

/**
 * A non-playable character (NPC).
 */
export type GameNpc = GameCharacter & {

    attacks: {

        hits: number[];

    }[];

    noblePhantasm: GameCharacterNoblePhantasm;

    maxLevel: number;

}
