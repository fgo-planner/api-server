import { ObjectId } from 'bson';
import { Request, Response } from 'express';
import { AccessTokenPayload, GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { UserGameAccountService } from 'services';
import { Inject } from 'typedi';
import { ObjectIdUtils } from 'utils';

@RestController('/user/game-account', UserAccessLevel.Authenticated)
export class UserGameAccountController {

    @Inject()
    private _gameAccountService: UserGameAccountService;

    @PutMapping()
    async addAccount(req: Request, res: Response): Promise<any> {
        let account = req.body;
        const userId = ObjectIdUtils.convertToObjectId(req.token.id);
        try {
            account = await this._gameAccountService.addAccount(userId, req.body);
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/current-user')
    async getAccountsForCurrentUser(req: Request, res: Response): Promise<any> {
        const userId = ObjectIdUtils.convertToObjectId(req.token.id);
        try {
            const accounts = await this._gameAccountService.findByUserId(userId);
            res.send(accounts);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getAccount(req: Request, res: Response): Promise<any> {
        const id = ObjectIdUtils.convertToObjectId(req.params.id);
        try {
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const account = await this._gameAccountService.findById(id);
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping()
    async updateAccount(req: Request, res: Response): Promise<any> {
        let account = req.body;
        const id = account._id = ObjectIdUtils.convertToObjectId(account._id);
        try {
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            account = await this._gameAccountService.update(account);
            if (!account) {
                return res.status(404).send(`Account ID ${id} does not exist.`);
            }
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Verifies that the user has access to the game account in question.
     * 
     * @param id The game account ID.
     * @param token The requesting user's access token payload.
     */
    private async _hasAccess(id: ObjectId, token: AccessTokenPayload): Promise<boolean> {
        const userId = this._getRequestorId(token);
        if (!userId) {
            return true;
        }
        return await this._gameAccountService.isOwner(id, userId);
    }

    /**
     * Extracts the Id of the user making the request for verification purposes. If
     * the user is an admin, then null is returned. 
     */
    private _getRequestorId(token: AccessTokenPayload): ObjectId {
        if (token.admin) {
            return null;
        }
        return ObjectIdUtils.convertToObjectId(token.id);
    }

}