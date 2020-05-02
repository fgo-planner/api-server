import { GameAccountServantNoblePhantasm, GameAccountServantSkill } from 'data/types';

/**
 * Represents an instance of a servant that is owned by the player account.
 */
export type GameAccountServant = {

    // TODO Add instance ID

    gameId: number;
    
    dateAcquired?: Date;

    level: number;

    bond?: number;

    fouAttack?: number;

    fouHealth?: number;

    skill1: GameAccountServantSkill;

    skill2: GameAccountServantSkill;

    skill3: GameAccountServantSkill;

    noblePhantasm: GameAccountServantNoblePhantasm;

}
