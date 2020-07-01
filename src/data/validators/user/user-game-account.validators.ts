export class UserGameAccountValidators {

    /**
     * Regex for checking if a game account ID string is in a valid format. Game
     * account IDs must be exactly 9 characters long and can only contain numerical
     * digits.
     */
    private static readonly _FriendIdFormatValidationRegex = /^\d{9}$/;

    /**
     * Validator function that tests the friend ID format validation RegExp against
     * the given friend ID string to check if it's in a valid format.
     */
    static isFriendIdFormatValid(id: string) {
        return UserGameAccountValidators._FriendIdFormatValidationRegex.test(id);
    };

    /**
     * Validator function that checks if a servant's fou upgrade value is valid. If
     * the value is less than or equal to 1000, the value must be a multiple of 10.
     * Otherwise, the value must be a multiple of 20.
     */
    static isFouValueValid(value: number) {
        if (value <= 1000) {
            return value % 10 === 0;
        }
        return value % 20 === 0;
    };

}
