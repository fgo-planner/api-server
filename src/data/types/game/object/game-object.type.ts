import { Entity } from 'internal';

/**
 * Base type that represents an in-game object.
 * 
 * Examples:
 * - Inventory items
 * - Spirit origins
 * - Non-playable characters (NPCs)
 * - Mystic codes
 */
export type GameObject = Entity<number> & {

    name?: string;

    displayName?: string;

    nameJp?: string;

    metadata: {

        urlPath?: string;

        altNames: string[];

        tags: string[];

        links: {

            label: string;

            url: string;

        }[];

    };

}
