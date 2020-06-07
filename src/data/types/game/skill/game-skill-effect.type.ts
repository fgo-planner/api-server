import { Entity } from 'internal';

/**
 * An effect of a skill. Corresponds to the `function` data in the datamined
 * game data and the Atlas Academy API data. Turn count, use count, success
 * rate, and values are not defined here; they instead defined in the game 
 * objects that owns this skill effect.
 */
export type GameSkillEffect = Entity<number> & {

    /**
     * The popup text that is displayed when the effect is activated.
     */
    text?: string;

    /**
     * The popup text that is displayed when the effect is activated, in Japanese.
     */
    textJp?: string;

    description?: string;

    descriptionJp?: string;

    // TODO Add other properties from Atlas Academy API data.

    /**
     * The ID of the icon displayed for the effect.
     */
    iconId?: number;

    /**
     * Alternative ID of the icon displayed for the effect.
     */
    iconId2?: number;

    /**
     * The IDs of the `GameSkillBuff` items that applied by this skill effect.
     */
    buffIds: number[];

    /**
     * Units displayed for the effect's values.
     */
    // TODO create enum for this.
    valueUnits?: any;

}