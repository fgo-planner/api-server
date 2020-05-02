/* eslint-disable max-len */
/**
 * Mongoose validation message strings.
 */
export class MongooseValidationStrings {

    ///#region Generic validation messages

    static readonly GenericInvalid = 'Path `{PATH}` ({VALUE}) is invalid.'

    static readonly GenericInvalidFormat = 'Path `{PATH}` ({VALUE}) is in an incorrect format.'

    static readonly GenericInvalidValue = 'Path `{PATH}` ({VALUE}) contains an invalid value.'
    
    //#endregion


    //#region Number validation messages

    static readonly NumberInteger = 'Path `{PATH}` ({VALUE}) is not an integer.';

    static readonly NumberMin = ''; // TODO Implement this

    static readonly NumberMax = ''; // TODO Implement this

    //#endregion

    
    static readonly GameAccountIdFormat = `${MongooseValidationStrings.GenericInvalidFormat} It must be exactly 9 characters long and can only contain numerical digits.`;

    static readonly GameAccountServantFirstSkillUnlocked = `${MongooseValidationStrings.GenericInvalidValue} The first skill must always be unlocked.`;

}