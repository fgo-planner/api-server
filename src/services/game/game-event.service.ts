import { GameEvent, GameEventModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { ObjectIdUtils } from 'utils';

@Service()
export class GameEventService {

    async create(event: GameEvent): Promise<GameEvent> {
        // TODO Validation
        const result = await GameEventModel.create(event);
        return result.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameEventModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: ObjectId): Promise<GameEvent | null> {
        const result = await GameEventModel.findById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findAll(): Promise<Array<GameEvent>> {
        const result = await GameEventModel.find();
        return result.map(doc => doc.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameEventModel.distinct('_id');
    }

    async findPage(page: Pagination): Promise<{data: Array<GameEvent>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameEventModel.find()
            .countDocuments();
        const result = await GameEventModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);
        const data = result.map(doc => doc.toObject());
        return { data, total: count };
    }

    async findByYear(year: number): Promise<Array<GameEvent>> {
        return GameEventModel.findByYear(year);
    }

    async update(event: GameEvent): Promise<GameEvent | null> {
        const id = ObjectIdUtils.instantiate(event._id);
        if (!id) {
            throw 'Event ID is missing or invalid.';
        }
        const result = await GameEventModel.findOneAndUpdate(
            { _id: id },
            { $set: event },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

}
