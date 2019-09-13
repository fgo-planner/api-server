import { Service } from 'typedi';
import { LoginController } from '../../controllers/public/login.controller';
import { AbstractRoute } from '../abstract.route';
import { Route } from 'internal/route.type';

@Service()
export class LoginRoute extends AbstractRoute<LoginController> {

    protected readonly _baseUrl = '/login';

    protected readonly _routes: Route[] = [
        {
            method: 'post',
            handler: this._controller.login
        },
        {
            path: '/register',
            method: 'post',
            handler: this._controller.register
        }
    ];

    constructor(protected readonly _controller: LoginController) {
        super();
    }

}
