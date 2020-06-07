import { GameObjectRegional } from 'data/types';
import { Pagination } from 'internal';
import { GameObjectService } from './game-object.service';

/**
 * Abstract service that provides basic CRUD operations and utility functions
 * for querying database collections of `GameObjectRegional` typed models.
 */
export abstract class GameObjectRegionalService<T extends GameObjectRegional> extends GameObjectService<T> {

    // TODO Add region related methods

    protected _generateSearchQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateSearchQuery(query, page);
        const conditions = _query.conditions;
        if (query.regions != null) {
            query.regions.split(',').forEach(region => {
                conditions[`gameRegions.${region}`] = true;
            });
        }
        return _query;
    }

}
