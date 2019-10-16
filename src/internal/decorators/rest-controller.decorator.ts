import { RequestMethod } from '../types/request-method.type';
import { Route } from '../types/route.type';
import { RouteSecurityLevel } from '../types/route-security-level.enum';

// Contains decorators for defining controllers and method mappings.
// Based on https://nehalist.io/routing-with-typescript-decorators/

export const RouteArrayName = 'routes';
export const RoutePrefixName = 'prefix';

/**
 * Helper function for updating route metadata.
 */
const updateMetadata = (target: any, propertyKey: any, data: any) => {
    if (!Reflect.hasMetadata(RouteArrayName, target.constructor)) {
        Reflect.defineMetadata(RouteArrayName, {}, target.constructor);
    }
    const routes: {[key: string]: Route} = Reflect.getMetadata(RouteArrayName, target.constructor);
    if (routes[propertyKey]) {
        Object.assign(routes[propertyKey], data);
    } else {
        routes[propertyKey] = data;
    }
};

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
        updateMetadata(target, propertyKey, {
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

/**
 * Indicates that the route is secured.
 * @param level (optional, default = 1) The level of security. A value of 0
 *              indicates that any user may access the route. A value of 1
 *              indicates that any authenticated user may access the route. A
 *              value of 2 indicates that only authenticated admin users may
 *              access the route.
 */
export const Secured = (level = RouteSecurityLevel.AUTHENTICATED) => {
    return (target: any, propertyKey: string) => {
        updateMetadata(target, propertyKey, {
            accessLevel: level,
            handlerName: propertyKey
        });
    };
};
