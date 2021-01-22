import { ObjectId } from 'bson';
import { Entity } from '../entity.type';
import { MasterItem } from './master-item.type';
import { MasterServant } from './master-servant.type';

export type MasterAccount = Entity<ObjectId> & {

    userId: ObjectId;

    /**
     * Account nickname.
     */
    name?: string;

    friendId?: string;

    exp?: number;

    qp: number;

    items: MasterItem[];

    servants: MasterServant[];

}
