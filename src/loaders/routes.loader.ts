import { GameDataImportController, GameEventController, GameItemController, GameServantController, LoginController, TestController, UserController, MasterAccountController } from 'controllers';
import { Application, Router } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { Class, ControllerMetadata, ControllerMetadataKey, RouteMetadata, RouteMetadataMapKey, UserAccessLevel } from 'internal';
import { AuthenticationService } from 'services';
import Container from 'typedi';

// TODO Make this configurable
const ResourceApiPrefix = '/rest';

const Controllers: Class<any>[] = [
    LoginController,
    UserController,
    MasterAccountController,
    GameDataImportController,
    GameEventController,
    GameItemController,
    GameServantController,
    TestController
];

const router = Router();

// Authentication middleware from AuthenticationService.
const authService = Container.get(AuthenticationService);
const parseAccessToken = authService.parseAccessToken.bind(authService);
const authenticateAccessToken = authService.authenticateAccessToken.bind(authService);
const authenticateAdminUser = authService.authenticateAdminUser.bind(authService);
 
/**
 * Registers a controller endpoint with the router.
 * @param instance The controller instance.
 * @param prefix The path prefix as defined by the controller.
 * @param route The route info.
 */
const registerRoute = (instance: any, prefix: string, defaultAccessLevel: UserAccessLevel, route: RouteMetadata,
    ...handlers: RequestHandler<Dictionary<string>>[]) => {

    const controllerName = instance.constructor.name;
    
    /*
     * Add authentication middleware based on route access level.
     * Level 0 -> parseAccessToken
     * Level 1 -> authenticateAccessToken
     * Level 2 -> authenticateAccessToken and authenticateAdminUser
     */
    const accessLevel = route.accessLevel || defaultAccessLevel;
    if (accessLevel >= UserAccessLevel.Authenticated) {
        handlers.push(authenticateAccessToken);
        if (accessLevel >= UserAccessLevel.Admin) {
            handlers.push(authenticateAdminUser);
        }
    } else {
        handlers.push(parseAccessToken);
    }

    // Get handler from controller and append to list of handlers.
    const handlerName = route.handlerName;
    const handler = instance[handlerName];
    if (typeof(handler) !== 'function') {
        console.error(`Could not register route: ${controllerName}.${handlerName} is not a function.`);
        return;
    }
    handlers.push(handler.bind(instance));

    // Construct path for the route mapping.
    const path = prefix + (route.path || '');

    // Register the route with the router.
    const method = route.method;
    router[method](path, handlers);
    console.log(`Registered ${(method as string).toUpperCase()} method at '${path}' using handler ${controllerName}.${handlerName}.`);
};

/**
 * Registers the endpoints of a controller with the router.
 * @param controller The controller class.
 */
const registerController = (prefix: string, controller: Class<any>, ...handlers: RequestHandler<Dictionary<string>>[]) => {
    const instance = Container.get(controller);
    const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(ControllerMetadataKey, controller);
    if (controllerMetadata === undefined) {
        console.error(`Could not register controller: ${controller.name} is not a controller.`);
        return;
    }
    const routes: {[key: string]: RouteMetadata} = Reflect.getMetadata(RouteMetadataMapKey, controller);
    for (const key of Object.keys(routes)) {
        const route = routes[key];
        registerRoute(instance, prefix + controllerMetadata.prefix, controllerMetadata.defaultAccessLevel, route, ...handlers);
    }
};

/**
 * Registers a list of controllers to the router.
 */
const registerControllers = (prefix: string, controllers: Class<any>[], ...handlers: RequestHandler<Dictionary<string>>[]) => {
    for (const controller of controllers) {
        registerController(prefix, controller, ...handlers);
    }
};

export default (app: Application) => {
    registerControllers(ResourceApiPrefix, Controllers);
    app.use(router);
};
