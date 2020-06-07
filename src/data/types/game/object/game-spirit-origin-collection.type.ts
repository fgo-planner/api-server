import { GameSpiritOrigin } from './game-spirit-origin.type';

/**
 * Base type that represents a spirit origin that is part of a collection. This
 * includes all types of spirit origins except for servant enhancement cards.
 */
export type GameSpiritOriginCollection = GameSpiritOrigin & {

    collectionNo: number;

    metadata: {

        illustratorId?: number;

    };

}
