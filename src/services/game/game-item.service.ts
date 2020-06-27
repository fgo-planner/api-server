import { GameItemDocument, GameItemModel } from 'data/models';
import { GameItem, GameItemType } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';

@Service()
export class GameItemService {

    async create(object: GameItem): Promise<GameItemDocument> {
        // TODO Validation
        return GameItemModel.create(object);
    }

    async findById(id: number): Promise<GameItemDocument> {
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        const object = await GameItemModel.findById(id).exec();
        if (!object) {
            throw `Item ID ${id} could not be found.`;
        }
        return object;
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

    async update(object: GameItem): Promise<GameItemDocument> {
        const id = Number(object._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const updated = await GameItemModel.findOneAndUpdate(
            { _id: id } as any,
            { $set: object },
            { runValidators: true, new: true }
        ).exec();
        if (!updated) {
            throw `Item ID ${id} does not exist.`;
        }
        return updated;
    }

}
