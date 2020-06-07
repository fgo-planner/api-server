import { GameObjectSkill } from './game-object-skill.type';
import { GameSpiritOriginCollection } from './game-spirit-origin-collection.type';

/**
 * A command code.
 */
export type GameCommandCode = GameSpiritOriginCollection & {

    description?: string;

    skill: GameObjectSkill;

}
