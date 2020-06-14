import { GameDataImportParseResult } from './game-data-import-parse-result.type';

/**
 * @param IN Input data datatype.
 */
export abstract class GameDataImportParser<IN> {

    private _parsed = false;

    protected readonly _result: GameDataImportParseResult;

    constructor(protected readonly _data: IN, parserName: string) {
        if (typeof _data !== 'object') {
            // TODO Throw exception
        }
        this._result = new GameDataImportParseResult(parserName);
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

}
