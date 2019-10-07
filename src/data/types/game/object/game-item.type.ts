import { GameItemCategory } from './game-item-category.type';
import { GameObject } from './game-object.type';

export type GameItem = GameObject & {
    description?: string;
    categories: GameItemCategory[];
}
