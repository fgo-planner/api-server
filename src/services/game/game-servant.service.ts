import { GameServantDocument, GameServantModel } from 'data/models';
import { GameServant } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';

@Service()
export class GameServantService {

    async create(servant: GameServant): Promise<GameServantDocument> {
        // TODO Validation
        return GameServantModel.create(servant);
    }

    async existsById(id: number) {
        if (!id && id !== 0) {
            throw 'Servant ID is missing or invalid.';
        }
        return await GameServantModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameServantDocument> {
        if (!id && id !== 0) {
            throw 'Servant ID is missing or invalid.';
        }
        return await GameServantModel.findById(id).exec();
    }

    async findByCollectionNo(collectionNo: number): Promise<GameServantDocument> {
        if (!collectionNo && collectionNo !== 0) {
            throw 'Collection number is missing or invalid.';
        }
        return await GameServantModel.findByCollectionNo(collectionNo).exec();
    }

    async findAll(): Promise<GameServantDocument[]> {
        return GameServantModel.find().exec();
    }

    async findAllIds(): Promise<number[]> {
        return GameServantModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: GameServantDocument[]; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 };
        const count = await GameServantModel.find()
            .countDocuments();
        const data = await GameServantModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async update(servant: GameServant): Promise<GameServantDocument> {
        const id = Number(servant._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        return await GameServantModel.findOneAndUpdate(
            { _id: id } as any,
            { $set: servant },
            { runValidators: true, new: true }
        ).exec();
    }

}
