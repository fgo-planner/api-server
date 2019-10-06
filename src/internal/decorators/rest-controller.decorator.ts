import { RequestMethod } from '../types/request-method.type';
import { Route } from '../types/route.type';

// Contains decorators for defining controllers and method mappings.
// Based on https://nehalist.io/routing-with-typescript-decorators/

export const RouteArrayName = 'routes';
export const RoutePrefixName = 'prefix';

export const RestController = (prefix = '') => {
    return (target: any) => {
        Reflect.defineMetadata(RoutePrefixName, prefix, target);
    };
};

/**
 * Decorator for mapping web requests onto methods in request-handling
 * classes with flexible method signatures.
 */
export const RequestMapping = (method: RequestMethod, path = '') => {
    return (target: any, propertyKey: string) => {
        if (!Reflect.hasMetadata(RouteArrayName, target.constructor)) {
            Reflect.defineMetadata(RouteArrayName, [], target.constructor);
        }
        const routes: Route[] = Reflect.getMetadata(RouteArrayName, target.constructor);
        routes.push({
            path,
            method,
            handlerName: propertyKey
        });
    };
};

/**
 * Decorator for mapping GET requests onto specific handler methods.
 * Shortcut equivalent of `@RequestMapping('get', path)`.
 */
export const GetMapping = (path = '') => {
    return RequestMapping('get', path);
};

/**
 * Decorator for mapping GET requests onto specific handler methods.
 * Shortcut equivalent of `@RequestMapping('post', path)`.
 */
export const PostMapping = (path = '') => {
    return RequestMapping('post', path);
};

/**
 * Decorator for mapping GET requests onto specific handler methods.
 * Shortcut equivalent of `@RequestMapping('put', path)`.
 */
export const PutMapping = (path = '') => {
    return RequestMapping('put', path);
};

/**
 * Decorator for mapping GET requests onto specific handler methods.
 * Shortcut equivalent of `@RequestMapping('delete', path)`.
 */
export const DeleteMapping = (path = '') => {
    return RequestMapping('delete', path);
};
