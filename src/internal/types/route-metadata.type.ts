import { RequestMethod, UserAccessLevel } from '../enum';

/**
 * Maps a route to a method in a controller.
 */
export type RouteMetadata = {

    path: string;

    accessLevel: UserAccessLevel;

    /**
     * The request method type (get, post, put, or delete).
     */
    method: RequestMethod;

    handlerName: string;

};
