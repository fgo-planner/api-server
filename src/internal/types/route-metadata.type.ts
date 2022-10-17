import { Nullable } from '@fgo-planner/common-core';
import { RequestMethod } from '../enum/request-method.enum';
import { UserAccessLevel } from '../enum/user-access-level.enum';

/**
 * Maps a route to an endpoint method in a controller.
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
