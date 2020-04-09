import { GameObject, GameServantAttribute, GameServantClass } from 'data/types';

export type GameServant = GameObject & {
    gameId: number;
    cost: number;
    class: GameServantClass;
    attribute: GameServantAttribute;
}
