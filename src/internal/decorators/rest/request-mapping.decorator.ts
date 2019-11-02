
import { RequestMethod, RouteMetadata, UserAccessLevel } from '../../';

export const RouteMetadataMapKey = 'routes';

/**
 * Helper function for parsing `RequestMapping` input parameters.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel) => {
    let path = '';
    let accessLevel: UserAccessLevel = undefined;
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
export function RequestMapping(method: RequestMethod): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping web requests to a handler method in a controller class
 * decorated with `RestController`.
 * 
 * The minimum user access level required to access the method is
 * inherited from the controller.
 * 
 * @param method The HTTP request method type.
 */
export function RequestMapping(method: RequestMethod, path: string): (target: any, propertyKey: string) => void;

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
export function RequestMapping(method: RequestMethod, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

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
export function RequestMapping(method: RequestMethod, path: string, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * `RequestMapping` function implementation.
 */
export function RequestMapping(method: RequestMethod, param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const { path, accessLevel } = parseInputs(param1, param2);

    return (target: any, propertyKey: string) => {
        // Add route map to controller metadata if its not already there.
        // TODO Verify that the class is decorated with `RestController`.
        if (!Reflect.hasMetadata(RouteMetadataMapKey, target.constructor)) {
            Reflect.defineMetadata(RouteMetadataMapKey, {}, target.constructor);
        }

        // Register the route metadata to the map.
        const routes: { [key: string]: RouteMetadata } = Reflect.getMetadata(RouteMetadataMapKey, target.constructor);
        routes[propertyKey] = {
            path,
            method,
            accessLevel,
            handlerName: propertyKey
        };
    };
};

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET)`.
 */
export function GetMapping(): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET, path)`.
 */
export function GetMapping(path: string): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.GET, accessLevel)`.
 */
export function GetMapping(accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping GET requests to a handler method in a controller.
 * 
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.GET, path, accessLevel)`.
 */
export function GetMapping(path: string, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * `GetMapping` function implementation.
 */
export function GetMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const { path, accessLevel } = parseInputs(param1, param2);
    return RequestMapping(RequestMethod.GET, path, accessLevel);
};

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST)`.
 */
export function PostMapping(): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST, path)`.
 */
export function PostMapping(path: string): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.POST, accessLevel)`.
 */
export function PostMapping(accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping POST requests to a handler method in a controller.
 * 
 * Shortcut equivalent of 
 * `@RequestMapping(RequestMethod.POST, path, accessLevel)`.
 */
export function PostMapping(path: string, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * `PostMapping` function implementation.
 */
export function PostMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const { path, accessLevel } = parseInputs(param1, param2);
    return RequestMapping(RequestMethod.POST, path, accessLevel);
};

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT)`.
 */
export function PutMapping(): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT, path)`.
 */
export function PutMapping(path: string): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.PUT, accessLevel)`.
 */
export function PutMapping(accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping PUT requests to a handler method in a controller.
 * 
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.PUT, path, accessLevel)`.
 */
export function PutMapping(path: string, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * `PutMapping` function implementation.
 */
export function PutMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const { path, accessLevel } = parseInputs(param1, param2);
    return RequestMapping(RequestMethod.PUT, path, accessLevel);
};

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE)`.
 */
export function DeleteMapping(): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE, path)`.
 */
export function DeleteMapping(path: string): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 * 
 * Shortcut equivalent of `@RequestMapping(RequestMethod.DELETE, accessLevel)`.
 */
export function DeleteMapping(accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * Decorator for mapping DELETE requests to a handler method in a controller.
 *
 * Shortcut equivalent of
 * `@RequestMapping(RequestMethod.DELETE, path, accessLevel)`.
 */
export function DeleteMapping(path: string, accessLevel: UserAccessLevel): (target: any, propertyKey: string) => void;

/**
 * `DeleteMapping` function implementation.
 */
export function DeleteMapping(param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const { path, accessLevel } = parseInputs(param1, param2);
    return RequestMapping(RequestMethod.DELETE, path, accessLevel);
};
