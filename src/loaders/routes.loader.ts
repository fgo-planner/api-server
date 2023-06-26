import { AppInfoController, AuthenticationController, EntityController, GameDataImportController, GameEventController, GameItemController, GameServantController, GameSoundtrackController, MasterAccountController, PlanController, TestController, UserController } from 'controllers';
import { Application, Router } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { CachedResponseMetadata, Class, ControllerMetadata, InvalidateCachedResponseMetadata, MetadataKey, ResponseCacheManager, RouteMetadata, UserAccessLevel } from 'internal';
import { AuthenticationService } from 'services';
import Container from 'typedi';

// TODO Make this configurable
const ResourceApiPrefix = '/rest';

const Controllers: Class<any>[] = [
    AppInfoController,
    AuthenticationController,
    EntityController,
    GameDataImportController,
    GameEventController,
    GameItemController,
    GameServantController,
    GameSoundtrackController,
    MasterAccountController,
    PlanController,
    TestController,
    UserController
];

const router = Router();

// Authentication middleware from AuthenticationService.
const authService = Container.get(AuthenticationService);
const parseAccessToken = authService.parseAccessToken.bind(authService);
const authenticateAccessToken = authService.authenticateAccessToken.bind(authService);
const authenticateAdminUser = authService.authenticateAdminUser.bind(authService);

// ResponseCacheManager
const responseCacheManager = Container.get(ResponseCacheManager);

/**
 * Registers a controller endpoint with the router.
 * 
 * @param controllerInstance The controller instance.
 * @param prefix The path prefix as defined at the controller level.
 * @param controllerAccessLevel The access level as defined at the controller
 * level. This will be used if access level is not defined at the route level.
 * @param routeMetadata The route metadata.
 */
const registerRoute = (
    controllerInstance: any,
    prefix: string,
    controllerAccessLevel: UserAccessLevel,
    routeMetadata: RouteMetadata,
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {

    const { handlerName, method } = routeMetadata;

    const controllerClass = controllerInstance.constructor;
    const controllerName = controllerClass.name;

    /*
     * Add authentication middleware based on route access level.
     * Level 0 -> parseAccessToken
     * Level 1 -> authenticateAccessToken
     * Level 2 -> authenticateAccessToken and authenticateAdminUser
     */
    const accessLevel = routeMetadata.accessLevel || controllerAccessLevel;
    if (accessLevel >= UserAccessLevel.Authenticated) {
        handlers.push(authenticateAccessToken);
        if (accessLevel >= UserAccessLevel.Admin) {
            handlers.push(authenticateAdminUser);
        }
    } else {
        handlers.push(parseAccessToken);
    }

    // Add cached response handling for the route if applicable.
    const cacheMetadataMap: Record<string, CachedResponseMetadata> = Reflect.getMetadata(MetadataKey.CachedResponse, controllerClass);
    const cacheMetadata = cacheMetadataMap?.[handlerName];
    if (cacheMetadata) {
        const cachedResponseHandler = responseCacheManager.getCachedResponseHandler(cacheMetadata);
        handlers.push(cachedResponseHandler);
    }

    // Add cached response invalidation handling for the route if applicable.
    const cacheInvalidationMetadataMap: Record<string, InvalidateCachedResponseMetadata> =
        Reflect.getMetadata(MetadataKey.InvalidateCachedResponse, controllerClass);
    const cacheInvalidationMetadata = cacheInvalidationMetadataMap?.[handlerName];
    if (cacheInvalidationMetadata) {
        const invalidateCachedResponseHandler = responseCacheManager.getInvalidateCachedResponseHandler(cacheInvalidationMetadata);
        handlers.push(invalidateCachedResponseHandler);
    }

    // Get endpoint handler from controller and append to list of handlers.
    const endpointHandler = controllerInstance[handlerName];
    if (typeof endpointHandler !== 'function') {
        console.error(`Could not register route: ${controllerName}.${handlerName} is not a function.`);
        return;
    }
    handlers.push(endpointHandler.bind(controllerInstance));

    // Construct path for the route mapping.
    const path = prefix + (routeMetadata.path || '');

    // Register the route with the router.
    router[method](path, handlers);

    // Print route to console.
    console.log(
        `Registered ${(method as string).toUpperCase()} method at '${path}' using handler ${controllerName}.${handlerName}` +
        (cacheMetadata ? ' with cache.' : '.')
    );
};

/**
 * Registers the endpoints of a controller with the router.
 * @param controller The controller class.
 */
const registerController = (
    prefix: string,
    controllerClass: Class<any>,
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    const controllerInstance = Container.get(controllerClass);
    const controllerMetadata: ControllerMetadata = Reflect.getOwnMetadata(MetadataKey.RestController, controllerClass);
    if (controllerMetadata === undefined) {
        console.error(`Could not register controller: ${controllerClass.name} is not a controller.`);
        return;
    }
    const routeMetadataMap: Record<string, RouteMetadata> = Reflect.getMetadata(MetadataKey.RequestMapping, controllerClass);
    for (const routeMetadata of Object.values(routeMetadataMap)) {
        registerRoute(
            controllerInstance,
            prefix + controllerMetadata.prefix,
            controllerMetadata.defaultAccessLevel,
            routeMetadata,
            ...handlers
        );
    }
};

/**
 * Registers a list of controllers to the router.
 */
const registerControllers = (
    prefix: string,
    controllers: Class<any>[],
    ...handlers: RequestHandler<Dictionary<string>>[]
): void => {
    for (const controllerClass of controllers) {
        registerController(prefix, controllerClass, ...handlers);
    }
};

export default (app: Application): void => {
    registerControllers(ResourceApiPrefix, Controllers);
    app.use(router);
};
