import { Entity } from 'internal';
import { GameSkillRank } from './game-skill-rank.enum';
import { GameSkillType } from './game-skill-type.enum';

/**
 * Contains data of an in-game skill. Corresponds to the `skill` data in the
 * datamined game data and the Atlas Academy API data.
 */
export type GameSkill = Entity<number> & {

    /**
     * The skill's categorical type, specific to this application. Does not
     * correlate to any in-game data points.
     */
    type: GameSkillType;

    name?: string;

    nameJp?: string;

    /**
     * The skill's rank. For skills that have a ranged rank (noble phantasms), this
     * is the lower bound of the range.
     */
    rank?: GameSkillRank;

    /**
     * The upper bound of a rank range. This should only be populated if the skill
     * has a ranged rank. Otherwise, the `rank` field should be used instead.
     */
    rankUpper?: GameSkillRank;

    // TODO Add formatted name (name + rank). This will be a calculated transient value.

    description?: string;

    descriptionJp?: string;

    /**
     * Base cooldown in number of turns, if applicable.
     */
    cooldown?: number;

    /**
     * The ID of the icon displayed for the skill.
     */
    iconId?: number;

    /**
     * Alternative ID of the icon displayed for the skill.
     */
    iconId2?: number;

    /**
     * The IDs of the `GameSkillEffect` items that apply to this skill. Each item
     * corresponds to the `funcId` properties in the datamined game data and the
     * Atlas Academy API data.
     */
    effectIds: number[];

}
