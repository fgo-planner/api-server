import { GameEventDocument, GameEventModel } from 'data/models';
import { GameEvent } from 'data/types';
import { Pagination } from 'internal';
import { Service } from 'typedi';

@Service()
export class GameEventService {

    async create(event: GameEvent): Promise<GameEventDocument> {
        // TODO Validation
        return GameEventModel.create(event);
    }

    async existsById(id: number) {
        if (!id && id !== 0) {
            throw 'Servant ID is missing or invalid.';
        }
        return await GameEventModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameEventDocument> {
        if (!id) {
            throw 'Event ID is missing or invalid.';
        }
        return await GameEventModel.findById(id).exec();
    }

    async findAll(): Promise<GameEventDocument[]> {
        return GameEventModel.find().exec();
    }

    async findAllIds(): Promise<number[]> {
        return GameEventModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: GameEventDocument[]; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 };
        const count = await GameEventModel.find()
            .countDocuments();
        const data = await GameEventModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async findByYear(year: number): Promise<GameEventDocument[]> {
        return GameEventModel.findByYear(year).exec();
    }

    async update(event: GameEvent): Promise<GameEventDocument> {
        const id = Number(event._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        return await GameEventModel.findOneAndUpdate(
            { _id: id } as any,
            { $set: event },
            { runValidators: true, new: true }
        ).exec();
    }

}
