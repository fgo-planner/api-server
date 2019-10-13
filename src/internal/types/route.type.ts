import { RequestMethod } from './request-method.type';
import { RouteSecurityLevel } from './route-security-level.enum';

/**
 * Maps a route to a method in a controller.
 */
export type Route = {

    path: string;

    accessLevel?: RouteSecurityLevel;

    /**
     * The request method type (get, post, put, or delete).
     */
    method: RequestMethod;

    handlerName: string;

}
