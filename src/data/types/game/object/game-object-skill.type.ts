import { GameObjectSkillEffect } from './game-object-skill-effect.type';

/**
 * A skill of a spirit origin or other in-game objects. Contains a reference ID
 * to a `GameSkill` document and the effect values of the skill.
 * 
 * Examples:
 * - Servant skills (active and passive)
 * - Mystic code skills
 * - Noble phantasms
 * - Craft essence effects
 * - Command code effects
 */
export type GameObjectSkill = {

    skillId: number;

    /**
     * The effects of the skill. Turn count, use count, success rate, and values
     * are defined here.
     */
    effects: GameObjectSkillEffect[];

}
