import { CreatePlan, PlanGrouping, UpdatePlan, UpdatePlanGrouping } from '@fgo-planner/data-core';
import { ObjectId } from 'bson';
import { Response } from 'express';
import { AuthenticatedRequest, DeleteMapping, GetMapping, PostMapping, PutMapping, RestController, UserAccessLevel } from 'internal';
import { MasterAccountService, PlanService } from 'services';
import { Inject } from 'typedi';
import { HttpRequestUtils, ObjectIdUtils } from 'utils';

@RestController('/user/planner', UserAccessLevel.Authenticated)
export class PlanController {

    @Inject()
    private _planService!: PlanService;

    @Inject()
    private _masterAccountService!: MasterAccountService;


    //#region Plan

    @PutMapping('/plan')
    async createPlan(req: AuthenticatedRequest<CreatePlan>, res: Response): Promise<any> {
        const plan = req.body;
        try {
            if (!plan.accountId) {
                throw 'Property \'accountId\' is required';
            }
            if (!await this._hasAccess(req, plan.accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const created = await this._planService.createPlan(plan);
            res.send(created);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/plan/:id')
    async getPlan(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const planId = HttpRequestUtils.parseObjectIdFromParams(req.params, 'id');
            const plan = await this._planService.findPlanById(planId);
            if (!plan || !await this._hasAccess(req, plan.accountId)) {
                return res.status(404).send(); // TODO Add message
            }
            res.send(plan);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @GetMapping('/plans/:accountId')
    async getPlansForAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const accountId = HttpRequestUtils.parseObjectIdFromParams(req.params, 'accountId');
            if (!await this._hasAccess(req, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const plans = await this._planService.findPlansByAccountId(accountId);
            res.send(plans);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/plan')
    async updatePlan(req: AuthenticatedRequest<UpdatePlan>, res: Response): Promise<any> {
        const plan = req.body;
        try {
            const planId = plan._id;
            if (!await this._hasAccess(req, plan.accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const updated = await this._planService.updatePlan(plan);
            if (!updated) {
                return res.status(404).send(`Plan id=${planId} could not be found`);
            }
            res.send(updated);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @DeleteMapping('/plan')
    async deletePlans(req: AuthenticatedRequest, res: Response): Promise<any> {
        const { accountId, planIds } = req.body;
        try {
            if (!Array.isArray(planIds)) {
                throw 'Property \'planIds\' must be an array';
            }
            if (!await this._hasAccess(req, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const result = await this._planService.deletePlans(accountId, planIds);
            res.send(String(result));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    //#endregion


    //#region Plan grouping

    @GetMapping('/plan-grouping/:accountId')
    async getPlanGroupingForAccount(req: AuthenticatedRequest, res: Response): Promise<any> {
        try {
            const accountId = HttpRequestUtils.parseObjectIdFromParams(req.params, 'accountId');
            if (!await this._hasAccess(req, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const planGrouping = await this._planService.findPlanGroupingByAccountId(accountId);
            res.send(planGrouping);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @PostMapping('/plan-grouping')
    async updatePlanGrouping(req: AuthenticatedRequest<UpdatePlanGrouping>, res: Response): Promise<any> {
        const { accountId, ...planGrouping } = req.body;
        const resync = true;  // TODO Make this configurable as part of query param or request body.
        try {
            if (!await this._hasAccess(req, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            let updated: PlanGrouping | null;
            if (resync) {
                updated = await this._planService.syncPlanGrouping(accountId, planGrouping);
            } else {
                updated = await this._planService.updatePlanGrouping(accountId, planGrouping);
            }
            if (!updated) {
                return res.status(404).send(); // TODO Add message
            }
            res.send(updated);
        } catch (err) {
            res.status(400).send(err);
        }
    }

    @DeleteMapping('/plan-grouping')
    async deletePlanGroups(req: AuthenticatedRequest, res: Response): Promise<any> {
        const { accountId, planGroupIds, deletePlans } = req.body;
        try {
            if (!Array.isArray(planGroupIds)) {
                throw 'Property \'planGroupIds\' must be an array';
            }
            if (!await this._hasAccess(req, accountId)) {
                return res.status(401).send(); // TODO Add message
            }
            const result = await this._planService.deletePlanGroups(accountId, planGroupIds, deletePlans);
            res.send(String(result));
        } catch (err) {
            res.status(400).send(err);
        }
    }

    //#endregion


    //#region Internal helper functions

    /**
     * Verifies that the requesting user has access to the account.
     * 
     * @param req The authenticated HTTP request.
     * @param accountId The master account ID that owns the plan.
     */
    private async _hasAccess(req: AuthenticatedRequest, accountId: ObjectId | string): Promise<boolean> {
        if (req.token.admin) {
            return true;
        }
        const userId = ObjectIdUtils.instantiate(req.token.id);
        return await this._masterAccountService.isOwner(userId, accountId);
    }

    //#endregion

}
