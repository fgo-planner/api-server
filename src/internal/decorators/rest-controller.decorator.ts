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
 * Helper function for adding route metadata for a method in a controller.
 * @param target The controller class.
 * @param propertyKey The name of the decorated method.
 * @param method The request method type (get, post, put, delete).
 */
const DefineMethodMapping = (target: any, propertyKey: string, path: string, method: RequestMethod) => {
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

export const GetMapping = (path = '') => {
    return (target: any, propertyKey: string) => {
        DefineMethodMapping(target, propertyKey, path, 'get');
    };
};

export const PostMapping = (path = '') => {
    return (target: any, propertyKey: string) => {
        DefineMethodMapping(target, propertyKey, path, 'post');
    };
};

export const PutMapping = (path = '') => {
    return (target: any, propertyKey: string) => {
        DefineMethodMapping(target, propertyKey, path, 'put');
    };
};

export const DeleteMapping = (path = '') => {
    return (target: any, propertyKey: string) => {
        DefineMethodMapping(target, propertyKey, path, 'delete');
    };
};
