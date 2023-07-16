import { GameEvent } from '@fgo-planner/data-core';
import { GameEventDocument, GameEventModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Page, Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { ObjectIdUtils, PaginationUtils } from 'utils';

@Service()
export class GameEventService {

    async create(event: GameEvent): Promise<GameEventDocument> {
        // TODO Validation
        const document = await GameEventModel.create(event);
        return document.toObject<GameEventDocument>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameEventModel.exists({ _id: id }).lean();
        return !!document;
    }

    async findById(id: ObjectId): Promise<GameEventDocument | null> {
        return await GameEventModel.findById(id).lean();
    }

    async findAll(): Promise<Array<GameEventDocument>> {
        return await GameEventModel.find().lean();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameEventModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameEventDocument>> {

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
            .limit(size)
            .lean();

        return PaginationUtils.toPage(documents, count, page, size);
    }

    async findByYear(year: number): Promise<Array<GameEventDocument>> {
        return GameEventModel.findByYear(year).lean();
    }

    async update(event: GameEvent): Promise<GameEventDocument | null> {
        const id = ObjectIdUtils.instantiate(event._id);
        if (!id) {
            throw 'Event ID is missing or invalid.';
        }
        return await GameEventModel.findOneAndUpdate(
            { _id: id },
            { $set: event },
            { runValidators: true, new: true }
        ).lean();
    }

}
