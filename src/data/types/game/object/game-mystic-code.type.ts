import { GameObjectRegional } from './game-object-regional.type';
import { GameObjectSkillLevelable } from './game-object-skill-levelable.type';

/**
 * A mystic code.
 */
export type GameMysticCode = GameObjectRegional & {

    description?: string;

    descriptionJp?: string;

    skill1: GameObjectSkillLevelable;

    skill2: GameObjectSkillLevelable;

    skill3: GameObjectSkillLevelable;

    exp: number[];

}
