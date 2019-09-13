import { NextFunction, Request, Response } from 'express';

/**
 * Maps a route to a method in a controller.
 */
export type Route = {

    path?: string;

    permissions?: string[];

    // TODO Add patch.
    // TODO Create separate type file for this.
    method: 'get' | 'post' | 'put' | 'delete';

    handler: (req: Request, res: Response, next: NextFunction) => void;

}
