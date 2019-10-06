import { Application, Router } from 'express';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import Container from 'typedi';
import { RouteArrayName, RoutePrefixName } from '../internal/decorators/rest-controller.decorator';
import { Class } from '../internal/types/class.type';
import { Route } from '../internal/types/route.type';
import { GameAccountController } from '../rest/controllers/game-account.controller';
import { LoginController } from '../rest/controllers/public/login.controller';
import { UserController } from '../rest/controllers/user.controller';
import { AuthenticationService } from '../services/user/authentication.service';

// TODO Make this configurable
const ResourceApiPrefix = '/rest';

const PublicControllers: Class<any>[] = [
    LoginController
];

const UserControllers: Class<any>[] = [
    UserController,
    GameAccountController
];

const AdminControllers: Class<any>[] = [

];

const router = Router();

/**
 * Registers a controller endpoint with the router.
 * @param instance The controller instance.
 * @param prefix The path prefix as defined by the controller.
 * @param route The route info.
 */
const registerRoute = (instance: any, prefix: string, route: Route, handlers: RequestHandler<Dictionary<string>>[]) => {
    const controllerName = instance.constructor.name;

    // TODO Add user permission handler.

    // Get handler from controller and append to list of handlers.
    const handlerName = route.handlerName;
    const handler = instance[handlerName];
    if (typeof(handler) !== 'function') {
        console.error(`Could not register route: ${controllerName}.${handlerName} is not a function.`);
        return;
    }
    handlers.push(handler.bind(instance));

    // Construct path for the route mapping.
    const path = (prefix || '') + (route.path || '');

    // Register the route with the router.
    const method = route.method;
    router[method](path, handlers);
    console.log(`Registered ${(method as string).toUpperCase()} method at '${path}' using handler ${controllerName}.${handlerName}.`);
};

/**
 * Registers the endpoints of a controller with the router.
 * @param controller The controller class.
 */
const registerController = (controller: Class<any>, handlers: RequestHandler<Dictionary<string>>[]) => {
    const instance = Container.get(controller);
    const prefix = Reflect.getMetadata(RoutePrefixName, controller);
    if (prefix === undefined) {
        console.error(`Could not register controller: ${controller.name} is not a controller.`);
        return;
    }
    const routes: Route[] = Reflect.getMetadata(RouteArrayName, controller);
    for (const route of routes) {
        registerRoute(instance, prefix, route, handlers);
    }
};

/**
 * Registers a list of controllers to the router.
 */
const registerControllers = (controllers: Class<any>[], ...handlers: RequestHandler<Dictionary<string>>[]) => {
    for (const controller of controllers) {
        registerController(controller, handlers);
    }
};

export default (app: Application) => {
    const authService = Container.get(AuthenticationService);
    registerControllers(PublicControllers);
    registerControllers(UserControllers, authService.authenticateToken);
    registerControllers(AdminControllers, authService.authenticateToken);
    app.use(ResourceApiPrefix, router);
};
