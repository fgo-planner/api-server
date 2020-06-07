import { Entity } from 'internal';
import { ExternalLink } from '../external-link.type';

/**
 * Base type representing the profile a person (or group), such as a
 * illustrator or voice actor.
 */
export type Person = Entity<number> & {

    name?: string;

    nameJp?: string;

    links: ExternalLink[];

}
