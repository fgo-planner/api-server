import { PageRequest } from '../internal';
import { Dictionary } from 'express-serve-static-core';

export class PageRequestUtils {

    // TODO Make these configurable.
    static readonly DefaultPageSize = 5;
    static readonly MaxPageSize = 100;
    static readonly DefaultDirection = 'ASC';

    static pageRequestFromParams(query: Dictionary<string>): PageRequest {
        const page = Number(query.page) || 1;
        let size = Number(query.limit) || PageRequestUtils.DefaultPageSize;
        if (size > PageRequestUtils.MaxPageSize) {
            size = PageRequestUtils.MaxPageSize;
        }
        const sort = query.sort;
        let direction: any = query.direction;
        if (direction !== 'ASC' && direction !== 'DESC') {
            direction = PageRequestUtils.DefaultDirection;
        }
        return {
            page,
            size,
            sort,
            direction
        };
    }

}
