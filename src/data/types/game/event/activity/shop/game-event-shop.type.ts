import { GameEventActivity } from '../game-event-activity.type';
import { GameEventShopItem } from './game-event-shop-item.type';

export type GameEventShop = GameEventActivity & {
    type: 'shop';
    inventory: GameEventShopItem[];
}