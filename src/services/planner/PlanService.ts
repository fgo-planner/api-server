import { BasicPlan, CreatePlan, CreatePlanGroup, Plan, PlanGroup, PlanGrouping, UpdatePlan, UpdatePlanGrouping } from '@fgo-planner/data-core';
import { MasterAccountModel, ObjectIdOrString, PlanModel } from '@fgo-planner/data-mongo';
import { Service } from 'typedi';

@Service()
export class PlanService {

    //#region Plan

    async createPlan(createPlan: CreatePlan): Promise<Plan> {
        const { groupId, ...plan } = createPlan;
        const document = await PlanModel.create(plan);
        const accountId = document.accountId;
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (planGrouping) {
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
            await this._syncPlanGrouping(accountId, planGrouping);
        }
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

    async updatePlan(updatePlan: UpdatePlan): Promise<Plan | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, accountId, ...plan } = updatePlan;
        if (!_id) {
            throw 'Plan ID is missing or invalid.';
        }
        const document = await PlanModel.findOneAndUpdate(
            { _id, accountId },
            { $set: plan },
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

    async updatePlanGrouping(updatePlanGrouping: UpdatePlanGrouping): Promise<PlanGrouping | null> {
        const { accountId, ...planGrouping } = updatePlanGrouping;
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

    async createPlanGroup(createPlanGroup: CreatePlanGroup): Promise<PlanGrouping | null> {
        const { accountId, ...planGroup } = createPlanGroup;
        const document = await MasterAccountModel.findOneAndUpdate(
            { accountId },
            { $push: { 'planGrouping.groups': planGroup } },
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
        await this._syncPlanGrouping(accountId, planGrouping);
        return count;
    }

    async syncPlanGroupingByAccountId(accountId: ObjectIdOrString): Promise<PlanGrouping | null> {
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (!planGrouping) {
            return null;
        }
        return await this._syncPlanGrouping(accountId, planGrouping);
    }

    async syncPlanGrouping(planGrouping: UpdatePlanGrouping<ObjectIdOrString>): Promise<PlanGrouping | null> {
        const planIds = await PlanModel.findPlanIdsByAccountId(planGrouping.accountId);
        const planIdSet = new Set(planIds.map(id => id.toString()));
        const updatedGroups: Array<PlanGroup<ObjectIdOrString>> = [];
        for (const planGroup of planGrouping.groups) {
            this._syncGroup(planGroup, planIdSet);
            updatedGroups.push(planGroup);
        }
        const updatedUngrouped: Array<string> = [];
        for (const planId of planGrouping.ungrouped) {
            const planIdString = planId.toString();
            if (planIdSet.delete(planIdString)) {
                updatedUngrouped.push(planIdString);
            }
        }
        if (planIdSet.size) {
            // Push remaining plans
            updatedUngrouped.push(...planIdSet);
        }
        planGrouping.ungrouped = updatedUngrouped;
        planGrouping.groups = updatedGroups;
        return await this.updatePlanGrouping(planGrouping as UpdatePlanGrouping);
    }

    private _syncPlanGrouping(accountId: ObjectIdOrString, planGrouping: PlanGrouping): Promise<PlanGrouping | null> {
        return this.syncPlanGrouping({
            accountId: accountId.toString(),
            ...planGrouping
        });
    }

    private _syncGroup(planGroup: PlanGroup<ObjectIdOrString>, planIdSet: Set<string>): void {
        const updatedPlans: Array<string> = [];
        for (const planId of planGroup.plans) {
            const planIdString = planId.toString();
            if (planIdSet.delete(planIdString)) {
                updatedPlans.push(planIdString);
            }
        }
        planGroup.plans = updatedPlans;
    }

    //#endregion

}
