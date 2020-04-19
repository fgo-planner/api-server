import { Entity } from 'internal';

/**
 * Base type that represents in-game objects, such as servants, enemies, craft
 * essences, and materials.
 */
export type GameObject = Entity & {
    name: string;
    nameJp?: string;
    rarity: number;
}
