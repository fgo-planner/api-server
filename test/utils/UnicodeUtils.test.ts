import { UnicodeUtils } from '../../src/utils';

describe('UnicodeUtils.convertUnicodeToAscii', () => {

    const TestCases: {[key: string]: string} = {
        '': '',
        'A': 'A',
        'b': 'b',
        'AbCdE' : 'AbCdE',
        '123' : '123',
        'Ｄ～Ｂ' : 'D~B',
        'Ｃ＋' : 'C+'
        // TODO Add more test cases
    };

    for (const input of Object.keys(TestCases)) {
        const expected = TestCases[input];
        it(`should return '${expected}' for '${input}'.`, () => {
            const result = UnicodeUtils.convertUnicodeToAscii(input);
            expect(result).toBe(expected);
        });
    }

});