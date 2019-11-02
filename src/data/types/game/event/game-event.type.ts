import { GameRegion } from 'game/game-region.type';
import { Entity } from '../../../../internal';
import { GameEventActivity } from './activity/game-event-activity.type';

export type GameEvent = Entity & {
    name: string;
    gameRegion: GameRegion;
    shortName?: string;
    startDate: Date;
    endDate: Date;
    activities: GameEventActivity[];
    currencies?: string[];
}
