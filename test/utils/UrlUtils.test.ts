import { UrlUtils } from '../../src/utils';

describe('UrlUtils.isSegmentValid', () => {

    const InvalidUrlPathSegments = [
        '',
        'UpperCase',
        'under_scores',
        'apostrophe\'s',
        '$peci@l=characters^',
        'white spaces    ',
        '-leading-and-trailing-hyphens-'
    ];

    const ValidUrlPathSegments = [
        'lowercase',
        'hyphens-aka-dashes',
        'numb3rs',
        'hyphens-and-numbers-1',
        'hyphens-and-numbers2'
    ];

    for (const urlPath of InvalidUrlPathSegments) {
        it(`should return false for '${urlPath}.'`, () => {
            const result = UrlUtils.isSegmentValid(urlPath);
            expect(result).toBe(false);
        });
    }

    for (const urlPath of ValidUrlPathSegments) {
        it(`should return true for '${urlPath}'.`, () => {
            const result = UrlUtils.isSegmentValid(urlPath);
            expect(result).toBe(true);
        });
    }

});

describe('UrlUtils.generateSegment', () => {

    const TestCases: {[key: string]: string} = {
        '': '',
        '  ': '',
        'lowercase': 'lowercase',
        'UpperCase': 'uppercase',
        'apostrophe\'s': 'apostrophes',
        'hyphens-aka-dashes' : 'hyphens-aka-dashes',
        '-leading-and-trailing-hyphens-' : 'leading-and-trailing-hyphens',
        'numb3rs': 'numb3rs',
        'under_scores': 'under-scores',
        'white spaces     ': 'white-spaces',
        'more   white   spaces': 'more-white-spaces',
        '$peci@l=characters^' : 'peci-l-characters',
        'more____special^*Characters': 'more-special-characters'
    };

    for (const input of Object.keys(TestCases)) {
        const expected = TestCases[input];
        it(`should return '${expected}' for '${input}'.`, () => {
            const result = UrlUtils.generateSegment(input);
            expect(result).toBe(expected);
        });
    }

});