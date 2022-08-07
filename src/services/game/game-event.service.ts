import { GameEvent, GameEventModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { ObjectIdUtils } from 'utils';

@Service()
export class GameEventService {

    async create(event: GameEvent): Promise<GameEvent> {
        // TODO Validation
        return GameEventModel.create(event);
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameEventModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: ObjectId): Promise<GameEvent | null> {
        return GameEventModel.findById(id).exec();
    }

    async findAll(): Promise<Array<GameEvent>> {
        return GameEventModel.find().exec();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameEventModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: Array<GameEvent>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameEventModel.find()
            .countDocuments();
        const data = await GameEventModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async findByYear(year: number): Promise<Array<GameEvent>> {
        return GameEventModel.findByYear(year).exec();
    }

    async update(event: GameEvent): Promise<GameEvent | null> {
        const id = ObjectIdUtils.instantiate(event._id);
        if (!id) {
            throw 'Event ID is missing or invalid.';
        }
        return GameEventModel.findOneAndUpdate(
            { _id: id },
            { $set: event },
            { runValidators: true, new: true }
        ).exec();
    }

}
