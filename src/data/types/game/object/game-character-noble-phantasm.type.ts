import { GameCharacterCardType } from './game-character-card-type.enum';
import { GameObjectSkill } from './game-object-skill.type';

/**
 * A servant or NPC's noble phantasm.
 */
export type GameCharacterNoblePhantasm = GameObjectSkill & {

    nameJpRuby?: string;

    classification?: string;

    classificationJp?: string;

    cardType: GameCharacterCardType;

    hits: number[];

}
