import { Plan, PlanGroup } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Response } from 'express';
import { AccessTokenPayload, AuthenticatedRequest, DeleteMapping, GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { MasterAccountService, PlanGroupService, PlanListService, PlanService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, ObjectIdUtils } from 'utils';

@RestController('/user/planner', UserAccessLevel.Authenticated)
export class PlanController {

    @Inject()
    private _planService!: PlanService;

    @Inject()
    private _planGroupService!: PlanGroupService;

    @Inject()
    private _planListService!: PlanListService;

    @Inject()
    private _masterAccountService!: MasterAccountService;

    @PutMapping('/plan')
    async addPlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        let plan = req.body as Partial<Plan>;
        try {
            const accountId = plan.accountId;
            if (!accountId) {
                throw 'Property \'accountId\' is required';
            }
            const userId = this._getRequestorId(req.token);
            if (userId && !this._masterAccountService.isOwner(userId, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            plan = await this._planService.addPlan(plan);
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PutMapping('/group')
    async addPlanGroup(req: AuthenticatedRequest, res: Response): Promise<any> {
        let planGroup = req.body as Partial<PlanGroup>;
        try {
            const accountId = planGroup.accountId;
            if (!accountId) {
                throw 'Property \'accountId\' is required';
            }
            const userId = this._getRequestorId(req.token);
            if (userId && !this._masterAccountService.isOwner(userId, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            planGroup = await this._planGroupService.addPlanGroup(planGroup);
            res.send(planGroup);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/plan/:id')
    async getPlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const plan = await this._planService.findById(id);
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/group/:id')
    async getPlanGroup(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const planGroup = await this._planGroupService.findById(id);
            res.send(planGroup);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/plan')
    async updatePlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        const plan = req.body as Partial<Plan>;
        try {
            const id = plan._id = ObjectIdUtils.instantiate(plan._id);
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const updated = await this._planService.update(plan);
            if (!updated) {
                return res.status(404).send(`Plan ID ${id} does not exist.`);
            }
            res.send(updated);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/group')
    async updatePlanGroup(req: AuthenticatedRequest, res: Response): Promise<any> {
        const planGroup = req.body as Partial<PlanGroup>;
        try {
            const id = planGroup._id = ObjectIdUtils.instantiate(planGroup._id);
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const updated = await this._planGroupService.update(planGroup);
            if (!updated) {
                return res.status(404).send(`Plan group ID ${id} does not exist.`);
            }
            res.send(updated);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @DeleteMapping('/plan/:id')
    async deletePlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const result = await this._planService.delete(id);
            res.send(String(result));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @DeleteMapping('/plan')
    async deletePlans(req: AuthenticatedRequest, res: Response): Promise<any> {
        const { planIds } = req.body;
        try {
            if (!Array.isArray(planIds)) {
                throw 'Property \'planIds\' must be an array';
            }
            const ids: Array<ObjectId> = [];
            for (const planId of planIds) {
                const id = new ObjectId(planId);
                if (!await this._hasAccess(id, req.token)) {
                    return res.status(401).send(); // TODO Add message
                }
                ids.push(id);
            }
            const result = await this._planService.delete(ids);
            res.send(String(result));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @DeleteMapping('/group/:id')
    async deletePlanGroup(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const id = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            if (!await this._hasAccess(id, req.token)) {
                return res.status(401).send(); // TODO Add message
            }
            const result = await this._planGroupService.delete(id);
            res.send(result);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/account/:accountId')
    async getForAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const accountId = HttpRequestUtils.parseObjectIdFromParams(req.params, 'accountId');
            const basicPlans = await this._planListService.findOrCreateByAccountId(accountId);
            res.send(basicPlans);
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
        return this._planService.isOwner(planId, userId);
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
