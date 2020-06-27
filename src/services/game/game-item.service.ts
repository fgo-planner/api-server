import { GameItemDocument, GameItemModel } from 'data/models';
import { GameItem, GameItemType } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';

@Service()
export class GameItemService {

    async create(item: GameItem): Promise<GameItemDocument> {
        // TODO Validation
        return GameItemModel.create(item);
    }

    async existsById(id: number) {
        if (!id && id !== 0) {
            throw 'Servant ID is missing or invalid.';
        }
        return await GameItemModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameItemDocument> {
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        return await GameItemModel.findById(id).exec();
    }

    async findAll(): Promise<GameItemDocument[]> {
        return GameItemModel.find().exec();
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

    async findByTypes(types: GameItemType | GameItemType[]): Promise<GameItemDocument[]> {
        return GameItemModel.findByTypes(types).exec();
    }

    async update(item: GameItem): Promise<GameItemDocument> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        return await GameItemModel.findOneAndUpdate(
            { _id: id } as any,
            { $set: item },
            { runValidators: true, new: true }
        ).exec();
    }

}
