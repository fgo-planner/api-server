import { GameObjectRegional } from './game-object-regional.type';
import { GameObjectSkill } from './game-object-skill.type';

/**
 * A mystic code.
 */
export type GameMysticCode = GameObjectRegional & {

    description?: string;

    descriptionJp?: string;

    skill1: GameObjectSkill;

    skill2: GameObjectSkill;

    skill3: GameObjectSkill;

    exp: number[];

}
