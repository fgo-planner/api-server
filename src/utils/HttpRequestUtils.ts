import { Nullable } from '@fgo-planner/common-core';
import { ObjectId } from 'bson';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectIdUtils } from './ObjectIdUtils';

interface ParsedQs { [key: string]: undefined | Query }

type Query = Nullable<string | Array<string> | ParsedQs | Array<ParsedQs>>;

export class HttpRequestUtils {

    private static readonly _MissingIdErrorMessage = 'Param \'id\' is missing.';

    /**
     * Parses a string of comma delimited integers from request params.
     * 
     * @deprecated Current not in use
     */
    static parseIntegerList(query: Query): Array<number> {
        const values = HttpRequestUtils.flattenParamsList(query);
        return values.map(Number).filter(Number.isInteger);
    }

    /**
     * Parses a string of comma delimited values from request params.
     * 
     * @deprecated Current not in use
     */
    static flattenParamsList(query: Query, result: Array<string> = []): Array<string> {
        if (!query) {
            return result;
        }
        if (typeof query === 'string') {
            if (query.indexOf(',') === -1) {
                result.push(query);
            } else {
                result.push(...query.split(','));
            }
            return result;
        }
        if (Array.isArray(query)) {
            for (const sub of query) {
                this.flattenParamsList(sub, result);
            }
        }
        return result;
    }

    static parseNumericalIdFromParams(params: ParamsDictionary, key: string): number {
        const value = params[key];
        if (!value) {
            throw Error(this._MissingIdErrorMessage);
        }
        const result = Number(value);
        if (isNaN(result)) {
            throw Error(`'${value}' is not a valid ID.`);
        }
        return result;
    }

    static parseObjectIdFromParams(params: ParamsDictionary, key: string): ObjectId {
        const value = params[key];
        if (!value) {
            throw Error(this._MissingIdErrorMessage);
        }
        return ObjectIdUtils.instantiate(value);
    }

}
