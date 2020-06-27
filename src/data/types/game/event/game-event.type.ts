import { ObjectId } from 'bson';
import { GameEventActivity } from 'data/types';
import { Entity } from 'internal';

export type GameEvent = Entity<ObjectId> & {
    name: string;
    shortName?: string;
    startDate: Date;
    endDate: Date;
    activities: GameEventActivity[];
    currencies?: string[];
}
