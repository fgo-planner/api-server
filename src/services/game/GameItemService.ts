import { GameItem, GameItemModel, GameItemUsage } from '@fgo-planner/data-mongo';
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
        const result = await GameItemModel.create(item);
        return result.toObject();
    }

    async existsById(id: number): Promise<boolean> {
        const result = await GameItemModel.exists({ _id: id });
        return !!result;
    }

    async findById(id: number): Promise<GameItem | null> {
        const result = await GameItemModel.findById(id, this._basicProjection);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findAll(): Promise<Array<GameItem>> {
        const result = await GameItemModel.find({}, this._basicProjection);
        return result.map(doc => doc.toObject());
    }

    async findByIds(ids: Array<number>): Promise<Array<GameItem>> {
        if (!ids || !ids.length) {
            return [];
        }
        const result = await GameItemModel.find({ _id: { $in: ids } }, this._basicProjection);
        return result.map(doc => doc.toObject());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameItemModel.distinct('_id');
    }

    async findPage(page: Pagination): Promise<{ data: Array<GameItem>; total: number }> {
        const size = page.size;
        const skip = size * (page.page - 1);
        const sort = { [page.sort]: page.direction === 'ASC' ? 1 : -1 } as Record<string, SortOrder>;
        const count = await GameItemModel.find()
            .countDocuments();
        const result = await GameItemModel.find({}, this._basicProjection)
            .sort(sort)
            .skip(skip)
            .limit(size);
        const data = result.map(doc => doc.toObject());
        return { data, total: count };
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<Array<GameItem>> {
        const result = await GameItemModel.findByUsage(usage);
        return result.map(doc => doc.toObject());
    }

    async update(item: GameItem): Promise<GameItem | null> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        const result = await GameItemModel.findOneAndUpdate(
            { _id: id },
            { $set: item },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

}
