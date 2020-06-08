import { GameDataImportParseResult } from './game-data-import-parse-result.type';

/**
 * @param IN Input data datatype.
 */
export abstract class GameDataImportParser<IN> {

    private _parsed = false;

    protected readonly _result: GameDataImportParseResult;

    constructor(protected readonly _data: IN) {
        if (typeof _data !== 'object') {
            // TODO Throw exception
        }
        this._result = this._instantiateResultContainer();
    }

    parse(): GameDataImportParseResult {
        if (this._parsed) {
            return this._result;
        }
        this._parse();
        this._parsed = true;
        return this._result;
    }

    protected abstract _parse(): void;

    private _instantiateResultContainer(): GameDataImportParseResult {
        return {
            skillBuffs: [],
            skillEffects: [],
            skills: [],
            items: [],
            servants: [],
            npc: [],
            craftEssences: [],
            enhancementCards: [],
            commandCodes: [],
            mysticCodes: []
        };
    }

}
