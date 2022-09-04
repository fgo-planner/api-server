import { GameServant, GameServantModel } from '@fgo-planner/data-mongo';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class GameServantService {

    async create(servant: GameServant): Promise<GameServant> {
        // TODO Validation
        const result = await GameServantModel.create(servant);
        return result.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameServantModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number): Promise<GameServant | null> {
        const result = await GameServantModel.findById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findByCollectionNo(collectionNo: number): Promise<GameServant> {
        if (!collectionNo && collectionNo !== 0) {
            throw 'Collection number is missing or invalid.';
        }
        const result = await GameServantModel.findByCollectionNo(collectionNo);
        return result.toObject();
    }

    async findAll(): Promise<Array<GameServant>> {
        const result = await GameServantModel.find();
        return result.map(doc => doc.toObject());
    }

    async findByIds(ids: Array<number>): Promise<Array<GameServant>> {
        if (!ids || !ids.length) {
            return [];
        }
        const result = await GameServantModel.find({ _id: { $in: ids } });
        return result.map(doc => doc.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        const result = await GameServantModel.distinct('_id');
        return result.map(doc => doc.toObject());
    }

    async findPage(page: Pagination): Promise<{data: Array<GameServant>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameServantModel.find()
            .countDocuments();
        const result = await GameServantModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        const data = result.map(doc => doc.toObject());
        return { data, total: count };
    }

    async update(servant: GameServant): Promise<GameServant | null> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const result = await GameServantModel.findOneAndUpdate(
            { _id: id },
            { $set: servant },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

}
