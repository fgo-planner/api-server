import { Request } from 'express';
import { Page, Pagination } from 'internal';

export class PaginationUtils {

    // TODO Make these configurable.
    static readonly DefaultPageSize = 5;
    static readonly MaxPageSize = 100;
    static readonly DefaultDirection = 'ASC';

    static parse(request: Request): Pagination;
    static parse(query: any): Pagination;
    static parse(object: any): Pagination {
        let query;
        if (typeof object.query === 'object') {
            query = object.query;
        } else {
            query = object;
        }
        const page = Number(query.page) || 1;
        let size = Number(query.limit) || PaginationUtils.DefaultPageSize;
        if (size > PaginationUtils.MaxPageSize) {
            size = PaginationUtils.MaxPageSize;
        }
        const sort = query.sort;
        let direction: any = query.direction;
        if (direction !== 'ASC' && direction !== 'DESC') {
            direction = PaginationUtils.DefaultDirection;
        }
        return { page, size, sort, direction };
    }
    
    static toPage<T>(data: T[], total: number, pagination: Pagination): Page<T>;
    static toPage<T>(data: T[], total: number, page: number, size: number): Page<T>;
    static toPage<T>(data: T[], total: number, page: number | Pagination, size?: number): Page<T> {
        if (typeof page === 'object') {
            page = page.page;
        }
        return { data, total, page, size };
    }

}
