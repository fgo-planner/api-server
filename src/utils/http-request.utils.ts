export class HttpRequestUtils {
    
    /**
     * Parses a string of comma delimited integers from request params.
     */
    static parseIntegerList(param: string) {
        if (!param) {
            return [];
        }
        return param.split(',').map(Number).filter(Number.isInteger);
    }
    
}