import { ObjectId } from 'bson';

export type Entity = {
    _id?: ObjectId | string;
}