import { ObjectId } from 'bson';
import { Entity } from '../../entity.type';
import { GameEventMaterialSource } from './game-event-material-source.type';

export type GameEvent = Entity<ObjectId> & {
    name: string;
    shortName?: string;
    startDate: Date;
    endDate: Date;
    materialSources: GameEventMaterialSource[];
}
