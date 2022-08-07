
import { HttpRequestUtils } from '../../src/utils/http-request.utils';

describe('HttpRequestUtils.parseIntegerList', () => {

    it('should return [] for null.', () => {
        const result = HttpRequestUtils.parseIntegerList(null);
        expect(result.length).toBe(0);
    });

    it('should return [] for \'\'.', () => {
        const result = HttpRequestUtils.parseIntegerList('');
        expect(result.length).toBe(0);
    });

    const TestCases: {[key: string]: Array<number>} = {
        '123': [123],
        '123,456,789': [123,456,789],
        '123, 456, 789': [123],
        'ABC,123': [123],
        // TODO Add more test cases
    };

    for (const input of Object.keys(TestCases)) {
        const expected = TestCases[input];
        it(`should return [${expected}] for '${input}'.`, () => {
            const result = HttpRequestUtils.parseIntegerList(input);
            for (const num of expected) {
                expect(result).toContain(num);
            }
        });
    }

});