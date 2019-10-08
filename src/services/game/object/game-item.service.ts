import { GameItem } from 'game/object/game-item.type';
import { Service } from 'typedi';
import { GameItemModel } from '../../../data/models/game/object/game-item.model';

@Service()
export class GameItemService {

    async createItem(item: GameItem) {
        // TODO Validation
        return await GameItemModel.create(item);
    }

    async updateItem(item: GameItem) {
        if (!item._id) {
            throw 'Item ID is missing';
        }
        return await GameItemModel.findOneAndUpdate(
            { '_id': item._id },
            { $set: item },
            { runValidators: true, new: true }
        );
    }

    async findItems() {
        return await GameItemModel.find().exec();
    }

}
