import { GameItemCategory, GameObject } from 'data/types';

export type GameItem = GameObject & {
    description?: string;
    categories: GameItemCategory[];
}
