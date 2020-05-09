import { GameCharacter, GamePlayerObject, GameServantAscension, GameServantSkill } from 'data/types';
import { GameServantUpgrade } from './game-servant-upgrade.type';

/**
 * A servant with an ID number (and thus viewable in My Room -> Spirit Origin
 * List), including any non-summonable, servants. Does not include non-playable
 * servants that don't have an ID number; such servants should be classified as
 * a GameEnemy instead.
 */
export type GameServant = GamePlayerObject & GameCharacter & {

    cost: number;

    skills: {

        skill1: GameServantSkill;

        skill2: GameServantSkill;

        skill3: GameServantSkill;
        
        upgrade1: GameServantUpgrade;

        upgrade2: GameServantUpgrade;

        upgrade3: GameServantUpgrade;

        upgrade4: GameServantUpgrade;

        upgrade5: GameServantUpgrade;

        upgrade6: GameServantUpgrade;

        upgrade7: GameServantUpgrade;

        upgrade8: GameServantUpgrade;

        upgrade9: GameServantUpgrade;
        
    };

    acensions: {
        
        ascension1: GameServantAscension;
    
        ascension2: GameServantAscension;
    
        ascension3: GameServantAscension;
        
        ascension4: GameServantAscension;

    };


}
