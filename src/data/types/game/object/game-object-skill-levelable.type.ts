import { GameObjectSkill } from './game-object-skill.type';

export type GameObjectSkillLevelable = GameObjectSkill & {

    baseCooldown: number;

}
