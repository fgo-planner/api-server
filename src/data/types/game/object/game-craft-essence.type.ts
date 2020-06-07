import { GameObjectSkill } from './game-object-skill.type';
import { GameSpiritOriginCollection } from './game-spirit-origin-collection.type';

/**
 * A craft essence.
 */
export type GameCraftEssence = GameSpiritOriginCollection & {

    cost: number;

    skill: GameObjectSkill;

}
