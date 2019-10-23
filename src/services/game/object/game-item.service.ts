import { ObjectId } from 'bson';
import { GameItem } from 'game/object/game-item.type';
import { Service } from 'typedi';
import { GameItemModel } from '../../../data/models/game/object/game-item.model';
import { Pagination } from '../../../internal';
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

    async searchGameItems(page: Pagination) {
        const count = await GameItemModel.countDocuments();
        const data = await GameItemModel.find()
            .skip(page.size * (page.page - 1))
            .limit(page.size);
        return { data, total: count };
    }

    async updateGameItem(item: GameItem) {
        if (!item._id) {
            throw 'Item ID is missing';
        }
        return await GameItemModel.findOneAndUpdate(
            { '_id': item._id },
            { $set: item },
            { runValidators: true, new: true }
        );
    }

}
