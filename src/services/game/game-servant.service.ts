import { GameServant, GameServantModel } from '@fgo-planner/data';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class GameServantService {

    async create(servant: GameServant): Promise<GameServant> {
        // TODO Validation
        return GameServantModel.create(servant);
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameServantModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number): Promise<GameServant | null> {
        return GameServantModel.findById(id).exec();
    }

    async findByCollectionNo(collectionNo: number): Promise<GameServant> {
        if (!collectionNo && collectionNo !== 0) {
            throw 'Collection number is missing or invalid.';
        }
        return GameServantModel.findByCollectionNo(collectionNo).exec();
    }

    async findAll(): Promise<Array<GameServant>> {
        return GameServantModel.find().exec();
    }

    async findByIds(ids: Array<number>): Promise<Array<GameServant>> {
        if (!ids || !ids.length) {
            return [];
        }
        return GameServantModel.find({ _id: { $in: ids } }).exec();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameServantModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: Array<GameServant>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameServantModel.find()
            .countDocuments();
        const data = await GameServantModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async update(servant: GameServant): Promise<GameServant | null> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        return GameServantModel.findOneAndUpdate(
            { _id: id },
            { $set: servant },
            { runValidators: true, new: true }
        ).exec();
    }

}
