import { Entity } from 'internal';

/**
 * A buff given by a skill effect. Buffs typically contain visible icons that
 * are attached to servants and NPCs during battle. Corresponds to the `buff`
 * parameter in the Atlas Academy API data.
 */
export type GameSkillBuff = Entity<number> & {

    name?: string;

    nameJp?: string;

    description?: string;
    
    descriptionJp?: string;

    /**
     * The ID of the icon displayed for the buff.
     */
    icon: number;

    // TODO Add other properties from Atlas Academy API data.

}
