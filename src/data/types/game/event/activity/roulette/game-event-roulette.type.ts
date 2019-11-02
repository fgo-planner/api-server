import { GameEventActivity } from 'data/types';

export type GameEventRoulette = GameEventActivity & {
    type: 'roulette';
    boxes: any[];
    itemIds: string[];
    cost: number;
    currencyItemId: string;
}
