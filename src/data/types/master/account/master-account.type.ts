import { ObjectId } from 'bson';
import { Entity } from '../../entity.type';
import { MasterItem } from '../item/master-item.type';
import { MasterServant } from '../servant/master-servant.type';

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

};
