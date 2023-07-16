import { GameItem, GameItemUsage } from '@fgo-planner/data-core';
import { GameItemDocument, GameItemModel } from '@fgo-planner/data-mongo';
import { Page, Pagination } from 'dto';
import { SortOrder } from 'mongoose';
import { Service } from 'typedi';
import { PaginationUtils } from 'utils';

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
        return await GameItemModel.create(item);
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameItemModel.exists({ _id: id }).lean();
        return !!document;
    }

    async findById(id: number): Promise<GameItemDocument | null> {
        return await GameItemModel.findById(id, this._basicProjection).lean();
    }

    async findAll(): Promise<Array<GameItemDocument>> {
        return await GameItemModel.find({}, this._basicProjection).lean();
    }

    async findByIds(ids: Array<number>): Promise<Array<GameItemDocument>> {
        if (!ids || !ids.length) {
            return [];
        }
        return await GameItemModel.find({ _id: { $in: ids } }, this._basicProjection).lean();
    }

    async findAllIds(): Promise<Array<number>> {
        return GameItemModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameItemDocument>> {

        const count = await GameItemModel.find()
            .countDocuments();

        const {
            size,
            page,
            sort: sortBy,
            direction
        } = pagination;

        const skip = size * (page - 1);
        const sort: Record<string, SortOrder> = { [sortBy]: direction === 'ASC' ? 1 : -1 };

        const documents = await GameItemModel.find()
            .sort(sort)
            .skip(skip)
            .limit(size)
            .lean();

        return PaginationUtils.toPage(documents, count, page, size);
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<Array<GameItemDocument>> {
        return await GameItemModel.findByUsage(usage).lean();
    }

    async update(item: GameItem): Promise<GameItemDocument | null> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        return await GameItemModel.findOneAndUpdate(
            { _id: id },
            { $set: item },
            { runValidators: true, new: true }
        ).lean();
    }

}
