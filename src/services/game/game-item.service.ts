import { GameItem, GameItemModel, GameItemUsage } from '@fgo-planner/data';
import { Pagination } from 'dto';
import { SortOrder } from 'mongoose';
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

    async create(item: GameItem): Promise<GameItem> {
        // TODO Validation
        return GameItemModel.create(item);
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameItemModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number): Promise<GameItem | null> {
        return GameItemModel.findById(id, this._basicProjection).exec();
    }

    async findAll(): Promise<Array<GameItem>> {
        return GameItemModel.find({}, this._basicProjection).exec();
    }
    
    async findByIds(ids: Array<number>): Promise<Array<GameItem>> {
        if (!ids || !ids.length) {
            return [];
        }
        return GameItemModel.find({ _id: { $in: ids } }, this._basicProjection).exec();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameItemModel.distinct('_id').exec();
    }

    async findPage(page: Pagination): Promise<{data: Array<GameItem>; total: number}> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameItemModel.find()
            .countDocuments();
        const data = await GameItemModel.find({}, this._basicProjection)
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<Array<GameItem>> {
        return GameItemModel.findByUsage(usage).exec();
    }

    async update(item: GameItem): Promise<GameItem | null> {
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
