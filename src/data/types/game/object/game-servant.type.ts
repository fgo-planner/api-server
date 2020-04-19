import { GameObject, GameServantAttribute, GameServantClass } from 'data/types';

export type GameServant = GameObject & {
    cost: number;
    class: GameServantClass;
    attribute: GameServantAttribute;
}
