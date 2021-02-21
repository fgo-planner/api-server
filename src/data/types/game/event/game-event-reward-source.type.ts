import { GameEventRewardSourceType } from './game-event-reward-source-type.enum';

export type GameEventRewardSource = {

    type: GameEventRewardSourceType;

    name?: string;

    currencyId?: number;

    masterRewards: {

        silverFous: number;

        goldFous: number;

        silverEmbers: number;

        goldEmbers: number;

        manaPrisms: number;

        rarePrisms: number;
        
        qp: number;

        bronzeFruits: number;

        silverFruits: number;

        goldFruits: number;

        saintQuartz: number;

        summonTickets: number;

        flames: number;
        
        grails: number;
        
        lores: number;

        rerunLores: number;

    };

    enhancementRewards: { 

        itemId: number; 

        quantity: number;
        
    }[];

};
