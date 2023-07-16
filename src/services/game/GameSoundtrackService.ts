import { GameSoundtrack } from '@fgo-planner/data-core';
import { GameSoundtrackDocument, GameSoundtrackModel } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

@Service()
export class GameSoundtrackService {

    async create(soundtrack: GameSoundtrack): Promise<GameSoundtrackDocument> {
        const document = await GameSoundtrackModel.create(soundtrack);
        return document.toObject<GameSoundtrackDocument>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameSoundtrackModel.exists({ _id: id }).lean();
        return !!document;
    }

    async findById(id: number): Promise<GameSoundtrackDocument | null> {
        return await GameSoundtrackModel.findById(id).lean();
    }

    async findAll(): Promise<Array<GameSoundtrackDocument>> {
        return await GameSoundtrackModel.find({}).lean();
    }

    async findByIds(ids: Array<number>): Promise<Array<GameSoundtrackDocument>> {
        if (!ids || !ids.length) {
            return [];
        }
        return await GameSoundtrackModel.find({ _id: { $in: ids } }).lean();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameSoundtrackModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameSoundtrackDocument>> {

        const count = await GameSoundtrackModel.find()
            .countDocuments();

        const {
            size,
            page,
            sort: sortBy,
            direction
        } = pagination;

        const skip = size * (page - 1);
        const sort: Record<string, SortOrder> = { [sortBy]: direction === 'ASC' ? 1 : -1 };

        const documents = await GameSoundtrackModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size)
            .lean();

        return PaginationUtils.toPage(documents, count, page, size);
    }

    async update(soundtrack: GameSoundtrack): Promise<GameSoundtrackDocument | null> {
        const id = Number(soundtrack._id);
        if (!id && id !== 0) {
            throw 'Soundtrack ID is missing or invalid.';
        }
        return await GameSoundtrackModel.findOneAndUpdate(
            { _id: id },
            { $set: soundtrack },
            { runValidators: true, new: true }
        ).lean();
    }

}
