import { ObjectId } from 'bson';
import { GameCraftEssenceModel } from 'data/models';
import { GameCraftEssence } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';
import { GameObjectService } from './game-object.service';

@Service()
export class GameCraftEssenceService extends GameObjectService<GameCraftEssence> {

    constructor() {
        super(GameCraftEssenceModel);
    }

    async createGameCraftEssence(craftEssence: GameCraftEssence) {
        return await this._create(craftEssence);
    }

    async findGameCraftEssenceById(id: ObjectId | string) {
        return await this._findById(id);
    }
    
    async getGameCraftEssences() {
        return await GameCraftEssenceModel.find();
    }

    async searchGameCraftEssences(query: any, page: Pagination) {
        return this._search(query, page);
    }

    async updateGameCraftEssence(craftEssence: GameCraftEssence) {
        return await this._update(craftEssence);
    }

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
