export class UrlUtils {

    static readonly Regex = /^[a-z0-9\-]+$/;

    private static readonly _SegmentValidationRegex = new RegExp(UrlUtils.Regex);

    /**
     * Regex of chacacters to be removed when generating a URL path segment.
     * Currently only includes apostrophes.
     */
    private static readonly _SpecialCharacterRemovalRegex = new RegExp(/[\']/g);

    /**
     * Regex of chacacters to be replaced by hyphens when generating a URL path segment.
     */
    private static readonly _SpecialCharacterReplacementRegex = new RegExp(/[_\W+]+/g);

    /**
     * Checks if a URL path segment is valid.
     */
    static isSegmentValid(urlPath: string) {
        if (!UrlUtils._SegmentValidationRegex.test(urlPath)) {
            return false;
        }
        // Regex does not catch leading and trailing hyphens.
        if (urlPath.startsWith('-') || urlPath.endsWith('-')) {
            return false;
        }
        return true;
    }

    /**
     * Generates a URL path segment from a given string.
     */
    static generateSegment(str: string) {
        let result = str.trim()

            // Remove specific special characters first.
            .replace(UrlUtils._SpecialCharacterRemovalRegex, '')

            // Replace rest of special characters with hyphens.
            .replace(UrlUtils._SpecialCharacterReplacementRegex, '-')

            .toLowerCase();

        // Remove leading and trailing hyphens.
        if (result.startsWith('-')) {
            result = result.substr(1);
        }
        if (result.endsWith('-')) {
            result = result.substr(0, result.length - 1);
        }

        return result;
    }

}