import { ObjectId } from 'bson';
import { GameObject } from 'data/types';
import { Pagination } from 'internal';
import { Document, Model } from 'mongoose';

/**
 * Abstract service that provides basic CRUD operations and utility functions
 * for querying `GameObject` repositories.
 */
export abstract class GameObjectService<T extends GameObject> {

    constructor(private _model: Model<T & Document, {}>) {

    }

    protected _create(object: T): Promise<T & Document> {
        // TODO Validation
        delete object._id;
        return this._model.create(object);
    }

    protected _findById(id: ObjectId | string): Promise<T & Document> {
        id = this._convertToObjectId(id);
        if (!id) {
            throw 'ObjectId is missing or invalid.';
        }
        return this._model.findById(id).exec();
    }

    protected _find(): Promise<(T & Document)[]> {
        return this._model.find().exec();
    }

    protected async _search(query: any, page: Pagination): Promise<{data: (T & Document)[]; total: number}> {
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

    protected _update(object: T): Promise<T & Document> {
        if (!object._id || !ObjectId.isValid(object._id)) {
            throw 'Entity\'s ID is missing or invalid.';
        }
        return this._model.findOneAndUpdate(
            { '_id': new ObjectId(object._id) },
            { $set: object },
            { runValidators: true, new: true }
        ).exec();
    }

    // TODO Move this to a util class.
    protected _convertToObjectId(id: ObjectId | string) {
        if (typeof id !== 'string') {
            return id;
        }
        if (ObjectId.isValid(id)) {
            return new ObjectId(id);
        }
        return null;
    }

    protected abstract _generateQuery(query: any, page: Pagination): {
        conditions: any; 
        projection: any; 
        size: number; 
        skip: number; 
        sort: any;
    };

}