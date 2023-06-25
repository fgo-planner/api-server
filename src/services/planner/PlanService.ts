import { BasicPlan, CreatePlan, Plan, PlanGroup, PlanGrouping, UpdatePlan } from '@fgo-planner/data-core';
import { MasterAccountModel, ObjectIdOrString, PlanModel } from '@fgo-planner/data-mongo';
import { Service } from 'typedi';

@Service()
export class PlanService {

    //#region Plan

    async createPlan(plan: CreatePlan): Promise<Plan | null> {
        const { groupId, ...createDoc } = plan;
        const document = await PlanModel.create(createDoc);
        const accountId = document.accountId;
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (!planGrouping) {
            return null;
        }
        const planId = document._id.toHexString();
        let planGroupFound = false;
        if (groupId) {
            for (const planGroup of planGrouping.groups) {
                if (planGroup._id === groupId) {
                    planGroup.plans.push(planId);
                    planGroupFound = true;
                    break;
                }
            }
        }
        if (!planGroupFound) {
            // Push plan as ungrouped if the groupId was not provided or not found.
            planGrouping.ungrouped.push(planId);
        }
        await this.syncPlanGrouping(accountId, planGrouping);
        return document.toJSON<Plan>();
    }

    async findPlanById(id: ObjectIdOrString): Promise<Plan | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        const document = await PlanModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<Plan>();
    }

    async findPlansByAccountId(accountId: ObjectIdOrString): Promise<Array<BasicPlan>> {
        const documents = await PlanModel.findByAccountId(accountId);
        return documents.map(document => document.toJSON<BasicPlan>());
    }

    async updatePlan(plan: UpdatePlan): Promise<Plan | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, accountId, ...update } = plan;
        if (!_id) {
            throw 'Plan ID is missing or invalid.';
        }
        const document = await PlanModel.findOneAndUpdate(
            { _id, accountId },
            { $set: update },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<Plan>();
    }

    async deletePlans(accountId: ObjectIdOrString, planIds: Array<ObjectIdOrString>): Promise<number> {
        if (!planIds.length) {
            return 0;
        }
        const deletedCount = await this._deletePlans(accountId, planIds);
        await this.syncPlanGroupingByAccountId(accountId);
        return deletedCount;
    }

    private async _deletePlans(accountId: ObjectIdOrString, planIds: Array<ObjectIdOrString>): Promise<number> {
        const result = await PlanModel.deleteMany({ _id: { $in: planIds }, accountId });
        return result.deletedCount;
    }

    //#endregion


    //#region Plan grouping

    async findPlanGroupingByAccountId(accountId: ObjectIdOrString): Promise<PlanGrouping | null> {
        const document = await MasterAccountModel.findPlanGroupingById(accountId);
        if (!document) {
            return null;
        }
        return document.toJSON().planGrouping;
    }

    async updatePlanGrouping(accountId: ObjectIdOrString, planGrouping: PlanGrouping): Promise<PlanGrouping | null> {
        const document = await MasterAccountModel.findOneAndUpdate(
            { accountId },
            { $set: { planGrouping } },
            { runValidators: true, new: true, projection: MasterAccountModel.PlanGroupingProjection }
        );
        if (!document) {
            return null;
        }
        return document.toJSON().planGrouping;
    }

    async deletePlanGroups(accountId: ObjectIdOrString, planGroupIds: Array<ObjectIdOrString>, deletePlans = false): Promise<number> {
        if (!planGroupIds.length) {
            return 0;
        }
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (!planGrouping) {
            return 0;
        }
        let count = 0;
        const targetPlanGroupIdSet = new Set(planGroupIds.map(id => id.toString()));
        const removedPlanIds: Array<string> = [];
        const updatedGroups: Array<PlanGroup> = [];
        for (const planGroup of planGrouping.groups) {
            if (!targetPlanGroupIdSet.has(planGroup._id)) {
                updatedGroups.push(planGroup);
            } else {
                removedPlanIds.push(...planGroup.plans);
                count++;
            }
        }
        if (removedPlanIds.length) {
            if (deletePlans) {
                count += await this._deletePlans(accountId, removedPlanIds);
            } else {
                planGrouping.ungrouped.push(...removedPlanIds);
            }
        }
        planGrouping.groups = updatedGroups;
        await this.syncPlanGrouping(accountId, planGrouping);
        return count;
    }

    async syncPlanGroupingByAccountId(accountId: ObjectIdOrString): Promise<PlanGrouping | null> {
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (!planGrouping) {
            return null;
        }
        return await this.syncPlanGrouping(accountId, planGrouping);
    }

    async syncPlanGrouping(accountId: ObjectIdOrString, planGrouping: PlanGrouping): Promise<PlanGrouping | null> {
        const planIds = await PlanModel.findPlanIdsByAccountId(accountId);
        const planIdSet = new Set(planIds.map(id => id.toHexString()));
        const updatedGroups: Array<PlanGroup> = [];
        let hasChanges = false;
        for (const planGroup of planGrouping.groups) {
            if (this._syncGroup(planGroup, planIdSet)) {
                hasChanges = true;
            }
            updatedGroups.push(planGroup);
        }
        const updatedUngrouped: Array<string> = [];
        for (const planId of planGrouping.ungrouped) {
            if (!planIdSet.delete(planId)) {
                hasChanges = true;
            } else {
                updatedUngrouped.push(planId);
            }
        }
        if (planIdSet.size) {
            // Push remaining plans
            hasChanges = true;
            updatedUngrouped.push(...planIdSet);
        }
        if (!hasChanges) {
            return planGrouping;
        }
        planGrouping.ungrouped = updatedUngrouped;
        planGrouping.groups = updatedGroups;
        return await this.updatePlanGrouping(accountId, planGrouping);
    }

    private _syncGroup(planGroup: PlanGroup, planIdSet: Set<string>): boolean {
        let hasChanges = false;
        const updatedPlans: Array<string> = [];
        for (const planId of planGroup.plans) {
            if (!planIdSet.delete(planId)) {
                hasChanges = true;
            } else {
                updatedPlans.push(planId);
            }
        }
        if (hasChanges) {
            planGroup.plans = updatedPlans;
        }
        return hasChanges;
    }

    //#endregion

}
