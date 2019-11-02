import { UserAccessLevel } from 'internal';

export const ControllerMetadataKey = 'controller';

/**
 * Helper function for parsing `RestController` input parameters.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel) => {
    let prefix = '';
    let defaultAccessLevel = UserAccessLevel.Admin;
    if (typeof param1 === 'string') {
        prefix = param1;
        if (param2 !== undefined) {
            defaultAccessLevel = param2;
        }
    } else if (typeof param1 === 'number') {
        defaultAccessLevel = param1;
    }
    return { prefix, defaultAccessLevel };
};

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * The minimum user access level required to access any methods in the
 * controller is set to 'admin only' by default.
 */
export function RestController(): (target: any) => void;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * The minimum user access level required to access any methods in the
 * controller is set to 'admin only' by default.
 * 
 * @param prefix An optional prefix that will be prepended to each mapped 
 *               resource URIs in this contoller.
 */
export function RestController(prefix: string): (target: any) => void;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * @param defaultAccessLevel Sets the user access level that is required to
 *                           access the resources on this controller.
 */
export function RestController(defaultAccessLevel: UserAccessLevel): (target: any) => void;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * @param prefix An optional prefix that will be prepended to each mapped 
 *               resource URIs in this contoller.
 * @param defaultAccessLevel Sets the user access level that is required to
 *                           access the resources on this controller.
 */
export function RestController(prefix: string, defaultAccessLevel: UserAccessLevel): (target: any) => void;

/**
 * `RestController` function implementation.
 */
export function RestController(param1?: string | UserAccessLevel, param2?: UserAccessLevel) {
    const params = parseInputs(param1, param2);

    return (target: any) => {
        Reflect.defineMetadata(ControllerMetadataKey, params, target);
    };
};


