import { GameCraftEssenceModel } from 'data/models';
import { GameCraftEssence } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';
import { GamePlayerObjectService } from './game-player-object.service';

@Service()
export class GameCraftEssenceService extends GamePlayerObjectService<GameCraftEssence> {

    constructor() {
        super(GameCraftEssenceModel);
    }

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
