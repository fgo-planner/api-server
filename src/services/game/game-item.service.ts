import { GameItemDocument, GameItemModel } from 'data/models';
import { GameItem, GameItemUsage } from 'data/types';
import { Pagination } from 'dto';
import { Service } from 'typedi';

@Service()
export class GameItemService {

    async create(item: GameItem): Promise<GameItemDocument> {
        // TODO Validation
        return GameItemModel.create(item);
    }

    async existsById(id: number) {
        return await GameItemModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameItemDocument | null> {
        return await GameItemModel.findById(id).exec();
    }

    async findAll(): Promise<GameItemDocument[]> {
        return GameItemModel.find().exec();
    }
    
    async findByIds(ids: number[]): Promise<GameItemDocument[]> {
        if (!ids || !ids.length) {
            return [];
        }
        return GameItemModel.find({ _id: { $in: ids } }).exec();
    }

    async findAllIds(): Promise<number[]> {
        return GameItemModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: GameItemDocument[]; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 };
        const count = await GameItemModel.find()
            .countDocuments();
        const data = await GameItemModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<GameItemDocument[]> {
        return GameItemModel.findByUsage(usage).exec();
    }

    async update(item: GameItem): Promise<GameItemDocument | null> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        return await GameItemModel.findOneAndUpdate(
            { _id: id },
            { $set: item },
            { runValidators: true, new: true }
        ).exec();
    }

}
