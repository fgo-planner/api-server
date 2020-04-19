import { GamePlayerObject } from 'data/types';
import { Pagination } from 'internal';
import { Document, Model } from 'mongoose';
import { GameObjectService } from './game-object.service';

/**
 * Abstract service that provides basic CRUD operations and utility functions
 * for querying database collections of `GamePlayerObject` typed models.
 */
export abstract class GamePlayerObjectService<T extends GamePlayerObject> extends GameObjectService<T> {

    constructor(protected _model: Model<T & Document, {}>) {
        super(_model);
    }
    
    async findByUrlString(urlString: string): Promise<T & Document> {
        return this._model.findOne({ urlString } as any).exec();
    }

    async existsByUrlString(urlString: string) {
        return await this._model.exists({ urlString } as any);
    }

    // TODO Add queries by gameId.

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        if (query.regions != null) {
            query.regions.split(',').forEach(region => {
                conditions[`gameRegions.${region}`] = true;
            });
        }
        return _query;
    }

}