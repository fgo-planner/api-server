import { Entity, Range } from 'internal';
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
     * The skill's rank. The value data type depends on the skill type:
     * 
     * - `undefined` for skill types that are not ranked.
     * 
     * - A `GameSkillRank` constant for ranked skill types. If the skill itself is
     * not ranked, then the value should be set to `GameSkillRank.None`.
     * 
     * - A `Range<GameSkillRank>` object for skills that ranged rank. Currently,
     * this only applies to some noble phantasms.
     */
    rank?: GameSkillRank | Range<GameSkillRank>;

    // TODO Add formatted name (name + rank). This will be a calculated transient value.

    description?: string;

    descriptionJp?: string;

    icon?: number;

    /**
     * The IDs of the `GameSkillEffect` items that apply to this skill. Each item
     * corresponds to the `funcId` properties in the datamined game data and the
     * Atlas Academy API data.
     */
    effectIds: number[];

}
