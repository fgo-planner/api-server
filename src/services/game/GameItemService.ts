import { GameItem, GameItemUsage } from '@fgo-planner/data-core';
import { GameItemModel } from '@fgo-planner/data-mongo';
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

    async create(item: GameItem): Promise<GameItem> {
        // TODO Validation
        const document = await GameItemModel.create(item);
        return document.toJSON<GameItem>();
    }

    async existsById(id: number): Promise<boolean> {
        const document = await GameItemModel.exists({ _id: id });
        return !!document;
    }

    async findById(id: number): Promise<GameItem | null> {
        const document = await GameItemModel.findById(id, this._basicProjection);
        if (!document) {
            return null;
        }
        return document.toJSON<GameItem>();
    }

    async findAll(): Promise<Array<GameItem>> {
        const documents = await GameItemModel.find({}, this._basicProjection);
        return documents.map(document => document.toJSON());
    }

    async findByIds(ids: Array<number>): Promise<Array<GameItem>> {
        if (!ids || !ids.length) {
            return [];
        }
        const documents = await GameItemModel.find({ _id: { $in: ids } }, this._basicProjection);
        return documents.map(document => document.toJSON<GameItem>());
    }

    async findAllIds(): Promise<Array<number>> {
        return GameItemModel.distinct('_id');
    }

    async findPage(pagination: Pagination): Promise<Page<GameItem>> {

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
            .limit(size);

        const data = documents.map(document => document.toJSON<GameItem>());

        return PaginationUtils.toPage(data, count, page, size);
    }

    async findByUsage(usage: GameItemUsage | GameItemUsage[]): Promise<Array<GameItem>> {
        const documents = await GameItemModel.findByUsage(usage);
        return documents.map(document => document.toJSON<GameItem>());
    }

    async update(item: GameItem): Promise<GameItem | null> {
        const id = Number(item._id);
        if (!id && id !== 0) {
            throw 'Item ID is missing or invalid.';
        }
        const document = await GameItemModel.findOneAndUpdate(
            { _id: id },
            { $set: item },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<GameItem>();
    }

}
