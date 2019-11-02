import { GameEventActivity, GameRegion } from 'data/types';
import { Entity } from 'internal';

export type GameEvent = Entity & {
    name: string;
    gameRegion: GameRegion;
    shortName?: string;
    startDate: Date;
    endDate: Date;
    activities: GameEventActivity[];
    currencies?: string[];
}
