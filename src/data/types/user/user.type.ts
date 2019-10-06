import { Entity } from '../../../internal/types/entity.type';

export type User = Entity & {
    username?: string;
    hash?: string;
    email?: string;
    active?: boolean;
}
