import { GameCharacterAlignment } from './game-character-alignment.enum';
import { GameCharacterAttribute } from './game-character-attribute.enum';
import { GameCharacterClass } from './game-character-class.enum';
import { GameCharacterGender } from './game-character-gender.enum';
import { GameCharacterTrait } from './game-character-trait.enum';
import { GameObject } from './game-object.type';

/**
 * Base type that represents a servant or NPC (including NPC servants).
 */
export type GameCharacter = GameObject & {

    battleName?: string;

    battleNameJp?: string;

    class: GameCharacterClass;

    attribute: GameCharacterAttribute;

    // TODO Find a better way to represent this.
    alignment: GameCharacterAlignment[];

    traits: GameCharacterTrait[];

    gender: GameCharacterGender;
    
    /**
     * Minimum hit points of the character.
     */
    hpBase: number;

    /**
     * Maximum hit points of the character. For servants, this is their HP at their
     * natural maximum level cap.
     */
    hpMax: number;

    /**
     * Minimum attack of the character.
     */
    atkBase: number;

    /**
     * Maximum attack of the character. For servants, this is their attack at their
     * natural maximum level cap.
     */
    atkMax: number;

    /**
     * Critical star generation rate. Each unit is 0.1 of a percentage point (for)
     * example, `100` would be 10.0%).
     */
    starRate: number;

    /**
     * Death chance. Each unit is 0.1 of a percentage point (for example, `100`
     * would be 10.0%).
     */
    deathRate: number;

    /**
     * Critical star absorption rate in units of percent.
     */
    criticalWeight: number;

    other?: {
        // TODO Add other properties here.
    };

    metadata: {

        illustratorId?: number;

        cvId?: number;

    };

}
