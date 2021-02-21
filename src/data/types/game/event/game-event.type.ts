import { ObjectId } from 'bson';
import { Entity } from '../../entity.type';
import { GameEventRewardSource } from './game-event-reward-source.type';

export type GameEvent = Entity<ObjectId> & {
    name: string;
    shortName?: string;
    startDate: Date;
    endDate: Date;
    rerun: boolean;
    rewardSources: GameEventRewardSource[];
};
