import { GameObject } from 'data/types';

export type GameServant = GameObject & {
    number: number;
    cost: number;
}
