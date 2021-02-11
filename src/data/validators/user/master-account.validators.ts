import { MasterServant } from 'data/types';

export class MasterAccountValidators {

    /**
     * Regex for checking if a friend ID string is in a valid format. Friend IDs
     * must be exactly 9 characters long and can only contain numerical digits.
     */
    private static readonly _FriendIdFormatValidationRegex = /^\d{9}$/;

    /**
     * Validator function that tests the friend ID format validation RegExp against
     * the given friend ID string to check if it's in a valid format.
     */
    static isFriendIdFormatValid(id: string): boolean {
        return MasterAccountValidators._FriendIdFormatValidationRegex.test(id);
    };

    /**
     * Validator function that tests the friend ID format validation RegExp against
     * the given friend ID string to check if it's in a valid format. Null or empty
     * inputs will return true.
     */
    static isFriendIdFormalValidOrEmpty(id: string): boolean {
        if (!id) {
            return true;
        }
        return MasterAccountValidators._FriendIdFormatValidationRegex.test(id);
    };

    /**
     * Validator function that checks if a servant's fou upgrade value is valid. If
     * the value is less than or equal to 1000, the value must be a multiple of 10.
     * Otherwise, the value must be a multiple of 20.
     */
    static isFouValueValid(value: number): boolean {
        if (value <= 1000) {
            return value % 10 === 0;
        }
        return value % 20 === 0;
    };

    static servantInstanceIdsUnique(servants: MasterServant[]): boolean {
        if (!servants.length) {
            return true;
        }
        const instanceIds = new Set<number>();
        for (const servant of servants) {
            const instanceId = servant.instanceId;
            if (instanceIds.has(instanceId)) {
                return false;
            }
            instanceIds.add(instanceId);
        }
        return true;
    }

}
