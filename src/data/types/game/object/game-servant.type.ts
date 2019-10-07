import { GameObject } from './game-object.type';

export type GameServant = GameObject & {
    number: number;
    cost: number;
}
