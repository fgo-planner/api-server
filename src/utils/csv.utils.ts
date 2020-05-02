export class CsvUtils {

    /**
     * Regex for splitting a CSV file into lines.
     */
    private static readonly _FileSplitRegex = new RegExp(/\r\n|\n/);

    /**
     * Regex for splitting a CSV line into values.
     * 
     * @see https://stackoverflow.com/a/23582323
     */
    private static readonly _LineSplitRegex = new RegExp(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

    /**
     * ASCII code for double quote character.
     */
    private static readonly _DoubleQuoteCode = 34;

    /**
     * Splits the contents of a CSV file into an array of lines.
     */
    static splitFile(csv: string) {
        if (csv == null) {
            return [];
        }
        // Bad idea if file contains too many lines.
        return csv.split(this._FileSplitRegex);
    }

    /**
     * Splits a CSV line into an array of string values.
     */
    static splitLine(line: string) {
        if (line == null) {
            return [];
        }
        const split = line.split(this._LineSplitRegex);
        // Go through each value in the split line to remove surrounding quotes.
        for (let i = 0, length = split.length; i < length; i++) {
            const value = split[i];
            if (this._isEnclosedWithQuotes(value)) {
                split[i] = value.substr(1, value.length - 2);
            }
        }
        return split;
    }

    /**
     * Helper method for determining whether a string is enclosed in double quotes.
     */
    private static _isEnclosedWithQuotes(string: string) {
        if (string.length < 2) {
            return false;
        }
        return string.charCodeAt(0) === this._DoubleQuoteCode 
            && string.charCodeAt(string.length - 1) === this._DoubleQuoteCode;
    }

}