import { RequestMethod } from './request-method.type';

/**
 * Maps a route to a method in a controller.
 */
export type Route = {

    path: string;

    permissions?: string[];

    /**
     * The request method type (get, post, put, or delete).
     */
    method: RequestMethod;

    handlerName: string;

}
