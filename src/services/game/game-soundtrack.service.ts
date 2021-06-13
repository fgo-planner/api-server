import { GameSoundtrack, GameSoundtrackDocument, GameSoundtrackModel } from '@fgo-planner/data';
import { Pagination } from 'dto';
import { Service } from 'typedi';

@Service()
export class GameSoundtrackService {

    async create(soundtrack: GameSoundtrack): Promise<GameSoundtrackDocument> {
        // TODO Validation
        return GameSoundtrackModel.create(soundtrack);
    }

    async existsById(id: number): Promise<boolean> {
        return GameSoundtrackModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameSoundtrackDocument | null> {
        return GameSoundtrackModel.findById(id).exec();
    }

    async findAll(): Promise<GameSoundtrackDocument[]> {
        return GameSoundtrackModel.find({}).exec();
    }
    
    async findByIds(ids: number[]): Promise<GameSoundtrackDocument[]> {
        if (!ids || !ids.length) {
            return [];
        }
        return GameSoundtrackModel.find({ _id: { $in: ids } }).exec();
    }

    async findAllIds(): Promise<number[]> {
        return GameSoundtrackModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: GameSoundtrackDocument[]; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 };
        const count = await GameSoundtrackModel.find()
            .countDocuments();
        const data = await GameSoundtrackModel.find({})
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async update(soundtrack: GameSoundtrack): Promise<GameSoundtrackDocument | null> {
        const id = Number(soundtrack._id);
        if (!id && id !== 0) {
            throw 'Soundtrack ID is missing or invalid.';
        }
        return GameSoundtrackModel.findOneAndUpdate(
            { _id: id },
            { $set: soundtrack },
            { runValidators: true, new: true }
        ).exec();
    }

}
