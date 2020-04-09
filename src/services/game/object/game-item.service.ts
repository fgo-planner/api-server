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

    async createGameItem(item: GameItem) {
        return await this._create(item);
    }

    async findGameItemById(id: ObjectId | string) {
        return await this._findById(id);
    }
    
    async getGameItems() {
        return await GameItemModel.find();
    }

    async searchGameItems(query: any, page: Pagination) {
        return this._search(query, page);
    }

    async updateGameItem(item: GameItem) {
        return await this._update(item);
    }

    protected _generateQuery(query: any, page: Pagination): {conditions: any; projection: any; size: number; skip: number; sort: any} {
        const conditions: any = {};
        const projection: any = {};
        const sort: any = {};
        if (page.sort) {
            // TODO Only allow sorting by specific fields.
            sort[page.sort] = page.direction === 'ASC' ? 1 : -1;
        }
        if (query.search) {
            conditions.$text = {
                $search: query.search
            };
            projection.score = sort.score = { 
                $meta: 'textScore'
            };
        }
        if (query.rarity != null) {
            conditions.rarity = query.rarity;
        }
        if (query.regions != null) {
            conditions.gameRegions = {
                $all: query.regions.split(',')
            };
        }
        if (query.categories != null) {
            conditions.categories = {
                $in: query.categories.split(',')
            };
        }
        return {
            conditions,
            projection,
            skip: page.size * (page.page - 1),
            size: page.size,
            sort
        };
    }

}
