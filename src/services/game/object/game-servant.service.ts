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

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
        const _query = super._generateQuery(query, page);
        const conditions = _query.conditions;
        // TODO Add addition conditions
        return _query;
    }

}
