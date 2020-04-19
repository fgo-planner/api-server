import { ObjectId } from 'bson';
import { GameObject } from 'data/types';
import { Pagination } from 'internal';
import { Document, Model } from 'mongoose';
import { ObjectIdUtils } from 'utils';

/**
 * Abstract service that provides basic CRUD operations and utility functions
 * for querying `GameObject` repositories.
 */
export abstract class GameObjectService<T extends GameObject> {

    constructor(private _model: Model<T & Document, {}>) {

    }

    async create(object: T): Promise<T & Document> {
        // TODO Validation
        delete object._id;
        return this._model.create(object);
    }

    async findById(id: ObjectId | string): Promise<T & Document> {
        id = ObjectIdUtils.convertToObjectId(id);
        if (!id) {
            throw 'ObjectId is missing or invalid.';
        }
        return this._model.findById(id).exec();
    }

    async findByUrlString(urlString: string): Promise<T & Document> {
        return this._model.findOne({ urlString } as any).exec();
    }

    async existsByUrlString(urlString: string) {
        return await this._model.exists({ urlString } as any);
    }

    async findAll(): Promise<(T & Document)[]> {
        return this._model.find().exec();
    }

    async search(query: any, page: Pagination): Promise<{data: (T & Document)[]; total: number}> {
        const { conditions, projection, size, skip, sort } = this._generateQuery(query, page);
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
        const id = ObjectIdUtils.convertToObjectId(object._id);
        if (!id) {
            throw 'ObjectId is missing or invalid.';
        }
        return this._model.findOneAndUpdate(
            { _id: id as any }, 
            { $set: object },
            { runValidators: true, new: true }
        ).exec();
    }

    protected _generateQuery(query: {[key: string]: string}, page: Pagination) {
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
        if (query.regions != null) {
            query.regions.split(',').forEach(region => {
                conditions[`gameRegions.${region}`] = true;
            });
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