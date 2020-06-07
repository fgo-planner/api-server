/**
 * A partial type that is intersected with other `GameObjectSkill` types to
 * indicate that the skill may be locked and cannot be used until a specific
 * set of conditions are met.
 */
export type GameObjectSkillUnlockable = {

    unlock: {

        ascension: number;
    
        // TODO Add quest details.
        quest: boolean;
    
    };

}
