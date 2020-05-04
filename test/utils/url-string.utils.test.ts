import { UrlStringUtils } from '../../src/utils/url-string.utils';

describe('UrlStringUtils.isValid', () => {

    const InvalidUrlStrings = [
        '',
        'UpperCase',
        'under_scores',
        'apostrophe\'s',
        '$peci@l=characters^',
        'white spaces    ',
        '-leading-and-trailing-hyphens-'
    ];

    const ValidUrlStrings = [
        'lowercase',
        'hyphens-aka-dashes',
        'numb3rs',
        'hyphens-and-numbers-1',
        'hyphens-and-numbers2'
    ];

    for (const urlString of InvalidUrlStrings) {
        it(`should return false for '${urlString}.'`, () => {
            const result = UrlStringUtils.isValid(urlString);
            expect(result).toBe(false);
        });
    }

    for (const urlString of ValidUrlStrings) {
        it(`should return true for '${urlString}'.`, () => {
            const result = UrlStringUtils.isValid(urlString);
            expect(result).toBe(true);
        });
    }

});

describe('UrlStringUtils.generate', () => {

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
            const result = UrlStringUtils.generate(input);
            expect(result).toBe(expected);
        });
    }

});