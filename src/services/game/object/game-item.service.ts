import { GameItem } from 'game/object/game-item.type';
import { Service } from 'typedi';
import { GameItemModel } from '../../../data/models/game/object/game-item.model';

@Service()
export class GameItemService {

    async addItem(item: GameItem) {
        // TODO Validation
        return await GameItemModel.create(item);
    }

    async getItems() {
        return await GameItemModel.find().exec();
    }

}
