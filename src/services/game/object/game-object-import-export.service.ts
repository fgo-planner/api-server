import { GameObject, GameRegion } from 'data/types';
import { CsvUtils } from 'utils';

export abstract class GameObjectImportExportService<T extends GameObject> {

    //#region JSON import methods

    async importFromJson(jsonItems: any[]) {
        for (let i = 0, length = jsonItems.length; i < length; i++) {
            const object = this._convertJsonItemToObject(jsonItems[i]);
            // TODO Add logging
            await this._validateAndWriteObject(object);
        }
    }

    protected abstract _convertJsonItemToObject(object: any): T;

    //#endregion


    //#region CSV import methods

    async importFromCsv(csv: string) {
        const lines = CsvUtils.splitFile(csv);
        if (lines.length < 2) {
            // File must contains at least two lines: header + one entry
            // TODO Throw exception
            return;
        }
        const columnIndexMap = this._parseCsvHeader(lines[0]);
        for (let i = 1, lineCount = lines.length; i < lineCount; i++) {
            const line = lines[i].trim();
            if (line.length === 0) {
                continue;
            }
            const splitLine = CsvUtils.splitLine(line);
            const object = this._convertCsvLineToObject(columnIndexMap, splitLine);
            // TODO Add logging
            await this._validateAndWriteObject(object);
        }
    }

    private _parseCsvHeader(header: string): { [key: string]: number } {
        const result: { [key: string]: number } = {};
        const values = CsvUtils.splitLine(header);
        for (let i = 0, length = values.length; i < length; i++) {
            result[values[i]] = i;
        }
        return result;
    }

    /**
     * Converts the CSV line data into a GameObject. Sanity and null checks are not
     * performed inside this method.
     */
    protected abstract _convertCsvLineToObject(columnIndexMap: { [key: string]: number }, line: string[]): T;

    /**
     * Helper method for getting a value from a split CSV line based on the column
     * name and the column index map.
     */
    protected _getValueFromCsvLine(columnIndexMap: { [key: string]: number }, column: string, line: string[]) {
        const index = columnIndexMap[column];
        if (index === undefined) {
            return null;
        }
        return line[index].trim();
    }

    /**
     * Helper method for parsing a number from a CSV string value.
     */
    protected _parseNumberFromCsv(value: string) {
        return Number(value) || null;
    }

    /**
     * Helper method for parsing the gameRegions object from the CSV string value.
     */
    protected _parseGameRegionsFromCsv(value: string) {
        if (value == null) {
            return null;
        }
        const result: { [key in GameRegion]?: boolean } = {}
        const regions = value.split(',');
        for (const region of regions) {
            if (region in GameRegion) {
                result[region as GameRegion] = true;
            }
        }
        return result;
    }

    //#endregion

    protected async abstract _validateAndWriteObject(object: T): Promise<void>;

}