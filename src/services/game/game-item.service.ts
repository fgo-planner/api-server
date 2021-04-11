import { GameItem, GameItemDocument, GameItemModel, GameItemUsage } from '@fgo-planner/data';
import { Pagination } from 'dto';
import { Service } from 'typedi';

@Service()
export class GameItemService {

    /**
     * Projection that returns basic version of the document.
     */
    // TODO Add method parameters to request basic payloads.
    private readonly _basicProjection = { 
        description: 0,
        createdAt: 0,
        updatedAt: 0
    };

    async create(item: GameItem): Promise<GameItemDocument> {
        // TODO Validation
        return GameItemModel.create(item);
    }

    async existsById(id: number): Promise<boolean> {
        return GameItemModel.exists({ _id: id });
    }

    async findById(id: number): Promise<GameItemDocument | null> {
        return GameItemModel.findById(id, this._basicProjection).exec();
    }

    async findAll(): Promise<GameItemDocument[]> {
        return GameItemModel.find({}, this._basicProjection).exec();
    }
    
    async findByIds(ids: number[]): Promise<GameItemDocument[]> {
        if (!ids || !ids.length) {
            return [];
        }
        return GameItemModel.find({ _id: { $in: ids } }, this._basicProjection).exec();
    }

    async findAllIds(): Promise<number[]> {
        return GameItemModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: GameItemDocument[]; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 };
        const count = await GameItemModel.find()
            .countDocuments();
        const data = await GameItemModel.find({}, this._basicProjection)
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<GameItemDocument[]> {
        return GameItemModel.findByUsage(usage).exec();
    }

    async update(item: GameItem): Promise<GameItemDocument | null> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        return GameItemModel.findOneAndUpdate(
            { _id: id },
            { $set: item },
            { runValidators: true, new: true }
        ).exec();
    }

}
