import { Nullable } from '@fgo-planner/common-core';
import { ObjectId } from 'bson';
import { ParamsDictionary } from 'express-serve-static-core';
import { ObjectIdUtils } from './ObjectIdUtils';

interface ParsedQs { [key: string]: undefined | Query }

type Query = Nullable<string | Array<string> | ParsedQs | Array<ParsedQs>>;

export class HttpRequestUtils {

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

    static parseNumericalValueFromParams(params: ParamsDictionary, key: string): number {
        const value = params[key];
        if (!value) {
            throw this._getMissingParamError(key);
        }
        const result = Number(value);
        if (isNaN(result)) {
            throw Error(`'${value}' is not a valid number.`);
        }
        return result;
    }

    static parseNumericalIdFromParams(params: ParamsDictionary, key: string): number {
        const value = params[key];
        if (!value) {
            throw this._getMissingParamError(key);
        }
        const result = Number(value);
        if (!(result > 0)) {
            throw Error(`'${value}' is not a valid ID.`);
        }
        return result;
    }

    static parseObjectIdFromParams(params: ParamsDictionary, key: string): ObjectId {
        const value = params[key];
        if (!value) {
            throw this._getMissingParamError(key);
        }
        return ObjectIdUtils.instantiate(value);
    }

    private static _getMissingParamError(key: string): Error {
        return new Error(`Param '${key}' is missing`);
    }

}
