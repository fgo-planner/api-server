/**
 * Defines the turn count, use count, success rate, and values for a skill
 * effect.
 */
export type GameObjectSkillEffectValues = {

    /**
     * How many turns this effect lasts. This value is always constant if present,
     * regardless of skill's level. Corresponds to the `Turn` arrays in the Atlas
     * Academy API data. 
     */
    turns?: number;

    /**
     * How many times this effect is applied (for example, an evade skill that is
     * lasts for 2 attacks). This value is always constant if present, regardless
     * of the skill's level. Corresponds to the `Count` arrays in the Atlas Academy
     * API data. 
     */
    count?: number;

    /**
     * The success rates of applying this effect. Each unit is 0.1 of a percentage
     * point (for example, `100` would be 10.0%). Can contain multiple values if it
     * scales with the skill's level. Corresponds to the `Rate` arrays in the Atlas
     * Academy API data. 
     */
    successRates: number[];

    /**
     * The values this effect, such as buff amount. Can contain multiple values if
     * it scales with the skill's level. Corresponds to the `Value` arrays in the
     * Atlas Academy API data. 
     */
    values: number[];
    

}