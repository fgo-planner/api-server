import { GameSoundtrack, GameSoundtrackModel } from '@fgo-planner/data-mongo';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';

@Service()
export class GameSoundtrackService {

    async create(soundtrack: GameSoundtrack): Promise<GameSoundtrack> {
        // TODO Validation
        const result = await GameSoundtrackModel.create(soundtrack);
        return result.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameSoundtrackModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number): Promise<GameSoundtrack | null> {
        const result = await GameSoundtrackModel.findById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findAll(): Promise<Array<GameSoundtrack>> {
        const result = await GameSoundtrackModel.find({});
        return result.map(doc => doc.toObject());
    }
    
    async findByIds(ids: Array<number>): Promise<Array<GameSoundtrack>> {
        if (!ids || !ids.length) {
            return [];
        }
        const result = await GameSoundtrackModel.find({ _id: { $in: ids } });
        return result.map(doc => doc.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameSoundtrackModel.distinct('_id');
    }

    async findPage(page: Pagination): Promise<{data: Array<GameSoundtrack>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameSoundtrackModel.find()
            .countDocuments();
        const result = await GameSoundtrackModel.find({})
            .sort(sort)
            .skip(skip)
            .limit(size);
        const data = result.map(doc => doc.toObject());
        return { data, total: count };
    }

    async update(soundtrack: GameSoundtrack): Promise<GameSoundtrack | null> {
        const id = Number(soundtrack._id);
        if (!id && id !== 0) {
            throw 'Soundtrack ID is missing or invalid.';
        }
        const result = await GameSoundtrackModel.findOneAndUpdate(
            { _id: id },
            { $set: soundtrack },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

}
