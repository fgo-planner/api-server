import { GameObject } from './game-object.type';

export type GameCraftEssence = GameObject & {
    cost: number;
    effects: string[];
}
