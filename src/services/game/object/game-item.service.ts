import { GameItemModel } from 'data/models';
import { GameItem } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';
import { GameObjectService } from './game-object.service';

@Service()
export class GameItemService extends GameObjectService<GameItem> {

    constructor() {
        super(GameItemModel);
    }

    protected _generateSearchQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateSearchQuery(query, page);
        const conditions = _query.conditions;
        if (query.categories != null) {
            conditions.categories = {
                $in: query.categories.split(',')
            };
        }
        return _query;
    }

}
