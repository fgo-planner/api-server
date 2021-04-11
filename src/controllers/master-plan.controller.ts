import { ObjectId } from 'bson';
import { Response } from 'express';
import { AccessTokenPayload, AuthenticatedRequest, GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { MasterAccountService, MasterPlanService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, ObjectIdUtils } from 'utils';

@RestController('/user/master-plan', UserAccessLevel.Authenticated)
export class MasterPlanController {

    @Inject()
    private _masterPlanService!: MasterPlanService;

    @Inject()
    private _masterAccountService!: MasterAccountService;

    @PutMapping()
    async addPlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        let plan = req.body;
        const userId = new ObjectId(req.token.id);
        try {
            plan = await this._masterPlanService.addPlan(userId, plan);
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/account/:accountId')
    async getPlansForAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const accountId = HttpRequestUtils.parseObjectIdFromParams(req.params, 'accountId');
            const userId = this._getRequestorId(req.token);
            if (userId && !this._masterAccountService.isOwner(userId, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const plans = await this._masterPlanService.findByAccountId(accountId);
            res.send(plans);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/:id')
    async getPlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const plan = await this._masterPlanService.findById(id);
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping()
    async updatePlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        let plan = req.body;
        try {
            const id = plan._id = ObjectIdUtils.instantiate(plan._id);
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            plan = await this._masterPlanService.update(plan);
            if (!plan) {
                return res.status(404).send(`Plan ID ${id} does not exist.`);
            }
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    /**
     * Verifies that the user has access to the master plan in question.
     * 
     * @param planId The master plan ID.
     * @param token The requesting user's access token payload.
     */
    private async _hasAccess(planId: ObjectId, token: AccessTokenPayload): Promise<boolean> {
        const userId = this._getRequestorId(token);
        if (!userId) {
            return true;
        }
        return this._masterPlanService.isOwner(planId, userId);
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
