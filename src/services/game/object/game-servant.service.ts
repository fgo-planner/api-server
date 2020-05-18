import { GameServantModel } from 'data/models';
import { GameServant } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';
import { GamePlayerObjectService } from './game-player-object.service';

@Service()
export class GameServantService extends GamePlayerObjectService<GameServant> {

    constructor() {
        super(GameServantModel);
    }

    protected _generateSearchQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateSearchQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
