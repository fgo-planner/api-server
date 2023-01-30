import { Service } from 'typedi';
import { UserAccessLevel } from '../../enum/UserAccessLevel.enum';
import { MetadataKey } from '../MetadataKeyConstants';

type Decorator = (target: any) => void;

type RestControllerParams = {
    prefix: string,
    defaultAccessLevel: UserAccessLevel
};

/**
 * Helper function for parsing `RestController` input parameters.
 */
const parseInputs = (param1?: string | UserAccessLevel, param2?: UserAccessLevel): RestControllerParams => {
    let prefix = '';
    let defaultAccessLevel: UserAccessLevel = UserAccessLevel.Admin;
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
export function RestController(): Decorator;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * The minimum user access level required to access any methods in the
 * controller is set to 'admin only' by default.
 * 
 * @param prefix An optional prefix that will be prepended to each mapped 
 *               resource URIs in this controller.
 */
export function RestController(prefix: string): Decorator;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * @param defaultAccessLevel Sets the user access level that is required to
 *                           access the resources on this controller.
 */
export function RestController(defaultAccessLevel: UserAccessLevel): Decorator;

/**
 * Decorator for indicating that the class is a REST controller. Methods in
 * this class can be mapped as web resources using `RequestMapping` and the
 * equivalent shortcut decorators.
 * 
 * @param prefix An optional prefix that will be prepended to each mapped 
 *               resource URIs in this controller.
 * @param defaultAccessLevel Sets the user access level that is required to
 *                           access the resources on this controller.
 */
export function RestController(prefix: string, defaultAccessLevel: UserAccessLevel): Decorator;

/**
 * `RestController` function implementation.
 */
export function RestController(param1?: string | UserAccessLevel, param2?: UserAccessLevel): Decorator {
    const params = parseInputs(param1, param2);

    return (target: any) => {
        Reflect.defineMetadata(MetadataKey.RestController, params, target);

        // Register the RestController as a typedi Service.
        Service()(target);
    };
}
