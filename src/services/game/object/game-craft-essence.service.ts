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

    protected _generateSearchQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateSearchQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
