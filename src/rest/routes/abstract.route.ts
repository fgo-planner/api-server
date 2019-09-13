import { Router } from 'express';
import { Route } from 'internal/route.type';
import { RequestHandler, Dictionary } from 'express-serve-static-core';

/**
 * Contains the route definititions for the methods in a controller class.
 */
export abstract class AbstractRoute<T> {

    protected abstract readonly _baseUrl: string;

    protected abstract readonly _controller: T;

    protected abstract readonly _routes: Route[];

    registerRoutes(router: Router, ...handlers: RequestHandler<Dictionary<string>>[]) {
        if (!this._routes || !this._routes.length) {
            return;
        }
        this._routes.forEach(r => this._registerRoute(r, router, ...handlers));
    }

    // TODO Add support for middleware.
    private _registerRoute(route: Route, router: Router, ...handlers: RequestHandler<Dictionary<string>>[]) {
        if (!this._controller) {
            console.error('Controller cannot be null. Did you forget to assign the _controller property?');
            return;
        }
        const handler = route.handler;
        if (!handler) {
            console.error('Handler cannot be null!');
            return;
        }
        if (typeof handler !== 'function') {
            console.error('Handler must be a function');
            return;
        }
        const path = this._baseUrl + (route.path || '/');
        switch (route.method) {
        case 'get':
            router.get(path, ...handlers, route.handler.bind(this._controller));
            break;
        case 'post':
            router.post(path, ...handlers, route.handler.bind(this._controller));
            break;
        case 'put':
            router.put(path, ...handlers, route.handler.bind(this._controller));
            break;
        case 'delete':
            router.delete(path, route.handler.bind(this._controller));
            break;
        }
    }

}
