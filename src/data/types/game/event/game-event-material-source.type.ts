import { GameEventMaterialSourceType } from './game-event-material-source-type.enum';

export type GameEventMaterialSource = {

    type: GameEventMaterialSourceType;

    name?: string;

    currencyId?: number;

    materials: { 

        itemId: number; 

        quantity: number;
        
    }[];

}
