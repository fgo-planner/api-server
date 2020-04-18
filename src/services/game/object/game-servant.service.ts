import { ObjectId } from 'bson';
import { GameServantModel } from 'data/models';
import { GameServant } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';
import { GameObjectService } from './game-object.service';

@Service()
export class GameServantService extends GameObjectService<GameServant> {

    constructor() {
        super(GameServantModel);
    }

    async createServant(servant: GameServant) {
        return await this._create(servant);
    }

    async findServantById(id: ObjectId | string) {
        return await this._findById(id);
    }
    
    async getServants() {
        return await GameServantModel.find();
    }

    async searchServants(query: any, page: Pagination) {
        return this._search(query, page);
    }

    async updateServant(servant: GameServant) {
        return await this._update(servant);
    }

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
