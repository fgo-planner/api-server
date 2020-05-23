import { CsvUtils } from '../../src/utils/csv.utils';

describe('CsvUtils.splitFile', () => {

    it('should return empty array for null input', () => {
        const expected = [] as string[];
        const result = CsvUtils.splitFile(null);
        expect(result).toEqual(expected);
    });

    // TODO Add tests for valid inputs...

});

describe('CsvUtils.splitLine', () => {

    it('should return empty array for null input', () => {
        const expected = [] as string[];
        const result = CsvUtils.splitLine(null);
        expect(result).toEqual(expected);
    });

    it('should return array with empty string for empty input', () => {
        const expected = [''];
        const result = CsvUtils.splitLine('');
        expect(result).toEqual(expected);
    });

    const testLine1 = 'Hello,?,,\"\",\"Comma,Separated,Values\",\"Does this work?\"';
    it(`should return correct result for '${testLine1}'`, () => {
        const expected = [
            'Hello',
            '?',
            '',
            '',
            'Comma,Separated,Values',
            'Does this work?'
        ];
        const result = CsvUtils.splitLine(testLine1);
        expect(result).toEqual(expected);
    });

    const testLine2 = 'This cell has no quotes,\"\"This cell is surrounded by double double quotes.\"\"';
    it(`should return correct result for '${testLine2}'`, () => {
        const expected = [
            'This cell has no quotes',
            '\"This cell is surrounded by double double quotes.\"'
        ];
        const result = CsvUtils.splitLine(testLine2);
        expect(result).toEqual(expected);
    });


});