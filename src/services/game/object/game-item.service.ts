import { ObjectId } from 'bson';
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

    async createItem(item: GameItem) {
        return await this._create(item);
    }

    async findItemById(id: ObjectId | string) {
        return await this._findById(id);
    }
    
    async getItems() {
        return await GameItemModel.find();
    }

    async searchItems(query: any, page: Pagination) {
        return this._search(query, page);
    }

    async updateItem(item: GameItem) {
        return await this._update(item);
    }

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        if (query.categories != null) {
            conditions.categories = {
                $in: query.categories.split(',')
            };
        }
        return _query;
    }

}
