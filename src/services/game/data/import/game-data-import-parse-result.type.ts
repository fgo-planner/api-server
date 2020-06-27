import { GameItem, GameServant } from 'data/types';

export class GameDataImportParseResult {
    
    readonly logs: any; // TODO Implement this

    readonly items: GameItem[] = [];

    readonly servants: GameServant[] = [];

    constructor(public readonly parserName: string) {

    }

}
