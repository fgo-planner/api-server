import { GameEventActivity } from '../game-event-activity.type';

export type GameEventRoulette = GameEventActivity & {
    type: 'roulette';
    boxes: any[];
    itemIds: string[];
    cost: number;
    currencyItemId: string;
}
