import { Route } from 'internal/route.type';
import { Service } from 'typedi';
import { UserController } from '../controllers/user.controller';
import { AbstractRoute } from './abstract.route';

@Service()
export class UserRoute extends AbstractRoute<UserController> {

    protected readonly _baseUrl = '/user';

    protected readonly _routes: Route[] = [
        {
            path: '/test',
            method: 'get',
            handler: this._controller.test
        }
    ];

    constructor(protected readonly _controller: UserController) {
        super();
    }

}
