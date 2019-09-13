import { Application, Router } from 'express';
import { Class } from 'internal/class.type';
import Container from 'typedi';
import { AbstractRoute } from '../rest/routes/abstract.route';
import { LoginRoute } from '../rest/routes/public/login.route';
import { UserRoute } from '../rest/routes/user.route';
import { Dictionary, RequestHandler } from 'express-serve-static-core';
import { AuthenticationService } from '../services/user/authentication.service';

type RouteClass = Class<AbstractRoute<any>>;

const PublicRoutes: RouteClass[] = [
    LoginRoute
];

const UserRoutes: RouteClass[] = [
    UserRoute
];

const AdminRoutes: RouteClass[] = [

];

const router = Router();

/**
 * Helper function for registering the routes of a single route class.
 * @param routeClass The route class.
 */
const registerRoute = (routeClass: RouteClass, ...handlers: RequestHandler<Dictionary<string>>[]) => {
    const route = Container.get(routeClass);
    route.registerRoutes(router, ...handlers);
};

const registerRoutes = (routes: RouteClass[], ...handlers: RequestHandler<Dictionary<string>>[]) => {
    routes.forEach(r => registerRoute(r, ...handlers));
};

export default (app: Application) => {
    const authService = Container.get(AuthenticationService);
    registerRoutes(PublicRoutes);
    registerRoutes(UserRoutes, authService.authenticateToken);
    registerRoutes(AdminRoutes, authService.authenticateToken);
    app.use(router);
};
