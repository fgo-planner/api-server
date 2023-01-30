/**
 * @deprecated No longer used.
 */
export class UnicodeUtils {

    private static readonly _FullwidthCharCodeOffset = 65248;

    public static convertUnicodeToAscii(input: string) {
        if (!input) {
            return input;
        }
        const charCodes: Array<number> = [];
        
        for (let i = 0, length = input.length; i < length; i++) {
            let charCode = input.charCodeAt(i);

            // Already an ASCII character
            if (charCode < 256) {
                charCodes.push(charCode);
                continue;
            }

            // Unicode fullwidth character
            if (charCode >= 0xFF00 && charCode <= 0xFF5E) {
                charCode -= UnicodeUtils._FullwidthCharCodeOffset;
            }

            // TODO Add more character sets.

            charCodes.push(charCode);
        }
        
        return String.fromCharCode(...charCodes);
    }

}
