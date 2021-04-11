import { ObjectId } from 'bson';
import { Response } from 'express';
import { AccessTokenPayload, AuthenticatedRequest, GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { MasterAccountService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, ObjectIdUtils } from 'utils';

@RestController('/user/master-account', UserAccessLevel.Authenticated)
export class MasterAccountController {

    @Inject()
    private _masterAccountService!: MasterAccountService;

    @PutMapping()
    async addAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        let account = req.body;
        const userId = new ObjectId(req.token.id);
        try {
            account = await this._masterAccountService.addAccount(userId, account);
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/current-user')
    async getAccountsForCurrentUser(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const userId = new ObjectId(req.token.id);
            const accounts = await this._masterAccountService.findByUserId(userId);
            res.send(accounts);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const account = await this._masterAccountService.findById(id);
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping()
    async updateAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        let account = req.body;
        try {
            const id = account._id = ObjectIdUtils.instantiate(account._id);
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            account = await this._masterAccountService.update(account);
            if (!account) {
                return res.status(404).send(`Account ID ${id} does not exist.`);
            }
            res.send(account);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Verifies that the user has access to the master account in question.
     * 
     * @param accountId The master account ID.
     * @param token The requesting user's access token payload.
     */
    private async _hasAccess(accountId: ObjectId, token: AccessTokenPayload): Promise<boolean> {
        const userId = this._getRequestorId(token);
        if (!userId) {
            return true;
        }
        return this._masterAccountService.isOwner(accountId, userId);
    }

    /**
     * Extracts the ID of the user making the request for verification purposes. If
     * the user is an admin, then null is returned. 
     */
    private _getRequestorId(token: AccessTokenPayload): ObjectId | null {
        if (token.admin) {
            return null;
        }
        return ObjectIdUtils.instantiate(token.id);
    }

}
