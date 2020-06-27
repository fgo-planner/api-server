import { GameServantDocument, GameServantModel } from 'data/models';
import { GameServant } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';

@Service()
export class GameServantService {

    async create(object: GameServant): Promise<GameServantDocument> {
        // TODO Validation
        return GameServantModel.create(object);
    }

    async findById(id: number): Promise<GameServantDocument> {
        if (!id && id !== 0) {
            throw 'Servant ID is missing or invalid.';
        }
        const object = await GameServantModel.findById(id).exec();
        if (!object) {
            throw `Servant ID ${id} could not be found.`;
        }
        return object;
    }

    async findByCollectionNo(collectionNo: number): Promise<GameServantDocument> {
        if (!collectionNo && collectionNo !== 0) {
            throw 'Collection number is missing or invalid.';
        }
        const object = await GameServantModel.findByCollectionNo(collectionNo).exec();
        if (!object) {
            throw `Servant collection number ${collectionNo} could not be found.`;
        }
        return object;
    }

    async findAll(): Promise<GameServantDocument[]> {
        return GameServantModel.find().exec();
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

    async update(object: GameServant): Promise<GameServantDocument> {
        const id = Number(object._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const updated = await GameServantModel.findOneAndUpdate(
            { _id: id } as any,
            { $set: object },
            { runValidators: true, new: true }
        ).exec();
        if (!updated) {
            throw `Servant ID ${id} does not exist.`;
        }
        return updated;
    }

}
