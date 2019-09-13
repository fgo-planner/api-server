import { Entity } from 'internal/entity.type';

export type User = Entity & {
    username?: string;
    hash?: string;
    email?: string;
    active?: boolean;
}
