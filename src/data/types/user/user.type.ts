import { Entity } from '../../../internal';

export type User = Entity & {
    username: string;
    hash?: string;
    email?: string;
    admin?: boolean;
    active?: boolean;
}
