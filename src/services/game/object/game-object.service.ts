import { GameObjectModel } from 'data/models';
import { GameObject } from 'data/types';
import { Pagination } from 'internal';
import { Document } from 'mongoose';

/**
 * Abstract service that provides basic CRUD operations and utility functions
 * for querying database collections of `GameObject` typed models.
 */
export abstract class GameObjectService<T extends GameObject> {

    constructor(protected _model: GameObjectModel<T & Document>) {

    }

    async create(object: T): Promise<T & Document> {
        // TODO Validation
        console.log(this._model.SortProperties)
        return this._model.create(object);
    }

    async findById(id: number | string): Promise<T & Document> {
        id = Number(id);
        if (!id && id !== 0) {
            throw 'ObjectId is missing or invalid.';
        }
        const object = await this._model.findById(id).exec();
        if (!object) {
            throw 'Not Found';
        }
        return object;
    }

    async findAll(): Promise<(T & Document)[]> {
        return this._model.find().exec();
    }

    async search(query: any, page: Pagination): Promise<{data: (T & Document)[]; total: number}> {
        const { conditions, projection, size, skip, sort } = this._generateSearchQuery(query, page);
        const count = await this._model.find(conditions)
            .countDocuments();
        const data = await this._model.find(conditions)
            .select(projection)
            .sort(sort)
            .skip(skip)
            .limit(size);
        return { data, total: count };
    }

    async update(object: T): Promise<T & Document> {
        const id = Number(object._id);
        if (!id && id !== 0) {
            throw 'ID is missing or invalid.';
        }
        const updated = await this._model.findOneAndUpdate(
            { _id: id } as any,
            { $set: object },
            { runValidators: true, new: true }
        ).exec();
        if (!updated) {
            throw `ID ${id} does not exist.`;
        }
        return updated;
    }

    protected _generateSearchQuery(query: {[key: string]: string}, page: Pagination) {
        const conditions: any = {};
        const projection: any = {};
        const sort: any = {};
        if (page.sort) {
            // TODO Only allow sorting by specific fields.
            sort[page.sort] = page.direction === 'ASC' ? 1 : -1;
        }
        if (query.search) {
            conditions.$text = {
                $search: query.search
            };
            projection.score = sort.score = { 
                $meta: 'textScore'
            };
        }
        if (query.rarity != null) {
            conditions.rarity = query.rarity;
        }
        return {
            conditions,
            projection,
            skip: page.size * (page.page - 1),
            size: page.size,
            sort
        };
    }

}