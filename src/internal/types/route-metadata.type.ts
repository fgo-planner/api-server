import { RequestMethod, UserAccessLevel } from 'internal';
import { Nullable } from './generics/nullable.type';

/**
 * Maps a route to a method in a controller.
 */
export type RouteMetadata = {

    path: string;

    accessLevel: Nullable<UserAccessLevel>;

    /**
     * The request method type (get, post, put, or delete).
     */
    method: RequestMethod;

    handlerName: string;

};
