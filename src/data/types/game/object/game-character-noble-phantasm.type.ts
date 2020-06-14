import { GameSkillRank } from '../skill/game-skill-rank.enum';
import { GameCharacterCardType } from './game-character-card-type.enum';
import { GameObjectSkillEffect } from './game-object-skill-effect.type';

/**
 * A servant or NPC's noble phantasm.
 */
export type GameCharacterNoblePhantasm = {

    treasureDeviceId: number;
    
    name?: string;

    nameJp?: string;

    nameJpRuby?: string;

    /**
     * The noble phantasm's rank. If the noble phantasm has a ranged rank, this
     * is the lower bound of the range.
     */
    rank?: GameSkillRank;

    /**
     * The upper bound of a rank range. This should only be populated if the noble
     * phantasm has a ranged rank. Otherwise, the `rank` field should be used
     * instead.
     */
    rankUpper?: GameSkillRank;

    // TODO Add formatted name (name + rank). This will be a calculated transient value.

    description?: string;

    descriptionJp?: string;

    classification?: string;

    classificationJp?: string;

    cardType: GameCharacterCardType;

    hits: number[];

    /**
     * The ID of the icon displayed for the noble phantasm.
     */
    iconId?: number;

    /**
     * Alternative ID of the icon displayed for the noble phantasm.
     */
    iconId2?: number;

    /**
     * The effects of the skill. Turn count, use count, success rate, and values
     * are defined here.
     */
    effects: GameObjectSkillEffect[];

}
