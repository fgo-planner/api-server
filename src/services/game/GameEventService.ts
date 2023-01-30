import { GameEvent, GameEventModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Page, Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { ObjectIdUtils, PaginationUtils } from 'utils';

@Service()
export class GameEventService {

    async create(event: GameEvent): Promise<GameEvent> {
        // TODO Validation
        const document = await GameEventModel.create(event);
        return document.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameEventModel.exists({ _id: id });
        return !!document;
    }

    async findById(id: ObjectId): Promise<GameEvent | null> {
        const document = await GameEventModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toObject();
    }

    async findAll(): Promise<Array<GameEvent>> {
        const documents = await GameEventModel.find();
        return documents.map(document => document.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameEventModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameEvent>> {

        const count = await GameEventModel.find()
            .countDocuments();

        const {
            size,
            page,
            sort: sortBy,
            direction
        } = pagination;

        const skip = size * (page - 1);
        const sort: Record<string, SortOrder> = { [sortBy]: direction === 'ASC' ? 1 : -1 };

        const documents = await GameEventModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size);

        const data = documents.map(document => document.toObject());

        return PaginationUtils.toPage(data, count, page, size);
    }

    async findByYear(year: number): Promise<Array<GameEvent>> {
        return GameEventModel.findByYear(year);
    }

    async update(event: GameEvent): Promise<GameEvent | null> {
        const id = ObjectIdUtils.instantiate(event._id);
        if (!id) {
            throw 'Event ID is missing or invalid.';
        }
        const document = await GameEventModel.findOneAndUpdate(
            { _id: id },
            { $set: event },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toObject();
    }

}
