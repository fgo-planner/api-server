
import { RequestMethod, RouteMetadata, UserAccessLevel } from 'internal';
import { MetadataKey } from '../metadata-key.constants';

type Decorator = (target: any, propertyKey: string) => void;

type RequestMappingParams = {
    path: string,
    accessLevel?: UserAccessLevel
};

/**
 * Helper function for parsing `RequestMapping` input parameters.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel): RequestMappingParams => {
    let path = '';
    let accessLevel = undefined;
    if (typeof param1 === 'string') {
        path = param1;
        if (param2 !== undefined) {
            accessLevel = param2;
        }
    } else if (typeof param1 === 'number') {
        accessLevel = param1;
    }
    return { path, accessLevel };
};

/**
 * Decorator for mapping web requests to a handler method in a controller class
 * decorated with `RestController`.
 * 
 * The method is mapped to the default URI value of '/', relative to the
 * controller's URI prefix.
 * 
 * The minimum user access level required to access the method is
 * inherited from the controller.
 * 
 * @param method The HTTP request method type.
 */
export function RequestMapping(method: RequestMethod): Decorator;

/**
 * Decorator for mapping web requests to a handler method in a controller class
 * decorated with `RestController`.
 * 
 * The minimum user access level required to access the method is
 * inherited from the controller.
 * 
 * @param method The HTTP request method type.
 */
export function RequestMapping(method: RequestMethod, path: string): Decorator;

/**
 * Decorator for mapping web requests to a handler method in a controller class
 * decorated with `RestController`.
 * 
 * The minimum user access level required to access the method is
 * inherited from the controller.
 *
 * @param method The HTTP request method type.
 * @param accessLevel The minimum user access level required to access the 
 *                    method. This overrides the controller's value.
 */
export function RequestMapping(method: RequestMethod, accessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for mapping web requests to a handler method in a controller class
 * decorated with `RestController`.
 *
 * @param method The HTTP request method type.
 * @param path The URI path of the method relative to the controller's URI
 *             prefix.
 * @param accessLevel The minimum user access level required to access the 
 *                    method. This overrides the controller's value.
 */
// eslint-disable-next-line max-len
export function RequestMapping(method: RequestMethod, path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * `RequestMapping` function implementation.
 */
export function RequestMapping(method: RequestMethod, param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);

    return (target: any, propertyKey: string) => {
        // Add route map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(MetadataKey.RequestMapping, target.constructor)) {
            Reflect.defineMetadata(MetadataKey.RequestMapping, {}, target.constructor);
        }

        // Register the route metadata to the map.
        const routes: Record<string, RouteMetadata> = Reflect.getMetadata(MetadataKey.RequestMapping, target.constructor);
        routes[propertyKey] = {
            path,
            method,
            accessLevel,
            handlerName: propertyKey
        };
    };
}

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET)`.
 */
export function GetMapping(): Decorator;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET, path)`.
 */
export function GetMapping(path: string): Decorator;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET, accessLevel)`.
 */
export function GetMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.GET, path, accessLevel)`.
 */
export function GetMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * `GetMapping` function implementation.
 */
export function GetMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.GET, path);
    }
    return RequestMapping(RequestMethod.GET, path, accessLevel);
}

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST)`.
 */
export function PostMapping(): Decorator;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST, path)`.
 */
export function PostMapping(path: string): Decorator;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST, accessLevel)`.
 */
export function PostMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of 
 * `@RequestMapping(RequestMethod.POST, path, accessLevel)`.
 */
export function PostMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * `PostMapping` function implementation.
 */
export function PostMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.POST, path);
    }
    return RequestMapping(RequestMethod.POST, path, accessLevel);
}

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT)`.
 */
export function PutMapping(): Decorator;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT, path)`.
 */
export function PutMapping(path: string): Decorator;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT, accessLevel)`.
 */
export function PutMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.PUT, path, accessLevel)`.
 */
export function PutMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * `PutMapping` function implementation.
 */
export function PutMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.PUT, path);
    }
    return RequestMapping(RequestMethod.PUT, path, accessLevel);
}

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE)`.
 */
export function DeleteMapping(): Decorator;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE, path)`.
 */
export function DeleteMapping(path: string): Decorator;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE, accessLevel)`.
 */
export function DeleteMapping(accessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 *
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.DELETE, path, accessLevel)`.
 */
export function DeleteMapping(path: string, accessLevel: UserAccessLevel): Decorator;

/**
 * `DeleteMapping` function implementation.
 */
export function DeleteMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const { path, accessLevel } = parseInputs(param1, param2);
    if (!accessLevel) {
        return RequestMapping(RequestMethod.DELETE, path);
    }
    return RequestMapping(RequestMethod.DELETE, path, accessLevel);
}
