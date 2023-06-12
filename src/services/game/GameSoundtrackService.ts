import { GameSoundtrack } from '@fgo-planner/data-core';
import { GameSoundtrackModel } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

@Service()
export class GameSoundtrackService {

    async create(soundtrack: GameSoundtrack): Promise<GameSoundtrack> {
        // TODO Validation
        const document = await GameSoundtrackModel.create(soundtrack);
        return document.toJSON<GameSoundtrack>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameSoundtrackModel.exists({ _id: id });
        return !!document;
    }

    async findById(id: number): Promise<GameSoundtrack | null> {
        const document = await GameSoundtrackModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<GameSoundtrack>();
    }

    async findAll(): Promise<Array<GameSoundtrack>> {
        const documents = await GameSoundtrackModel.find({});
        return documents.map(document => document.toJSON<GameSoundtrack>());
    }

    async findByIds(ids: Array<number>): Promise<Array<GameSoundtrack>> {
        if (!ids || !ids.length) {
            return [];
        }
        const documents = await GameSoundtrackModel.find({ _id: { $in: ids } });
        return documents.map(document => document.toJSON<GameSoundtrack>());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameSoundtrackModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameSoundtrack>> {

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
            .limit(size);

        const data = documents.map(document => document.toJSON<GameSoundtrack>());

        return PaginationUtils.toPage(data, count, page, size);
    }

    async update(soundtrack: GameSoundtrack): Promise<GameSoundtrack | null> {
        const id = Number(soundtrack._id);
        if (!id && id !== 0) {
            throw 'Soundtrack ID is missing or invalid.';
        }
        const document = await GameSoundtrackModel.findOneAndUpdate(
            { _id: id },
            { $set: soundtrack },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<GameSoundtrack>();
    }

}
