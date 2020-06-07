import { GameObjectSkillEffectValues } from './game-object-skill-effect-values.type';

/**
 * An effect of a game object skill. Contains a reference ID to a
 * `GameSkillEffect` document and the effect values of the skill effect.
 */
export type GameObjectSkillEffect = {

    effectId: number;

    /**
     * Defines the turn count, use count, success rate, and values for a skill
     * effect. For servant noble phantasms, this only applies for the first (100%)
     * overcharge level.
     */
    values: GameObjectSkillEffectValues;

};