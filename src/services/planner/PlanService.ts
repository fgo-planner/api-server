import { CreatePlan, CreatePlanGroup, MasterAccount, PlanGroup, PlanGrouping, SerializableDate, UpdatePlan, UpdatePlanGrouping } from '@fgo-planner/data-core';
import { MasterAccountModel, ObjectIdOrString, PlanDocument, PlanGroupDocument, PlanGroupingDocument, PlanModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Service } from 'typedi';
import { ObjectIdUtils } from 'utils';

type AnyPlanGroup = PlanGroup<ObjectIdOrString, ObjectIdOrString, SerializableDate>;

@Service()
export class PlanService {

    //#region Plan

    async createPlan(createPlan: CreatePlan): Promise<PlanDocument> {
        const { groupId, ...plan } = createPlan;
        const document = await PlanModel.create(plan);
        const accountId = document.accountId;
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (planGrouping) {
            const planId = document._id;
            let planGroupFound = false;
            if (groupId) {
                for (const planGroup of planGrouping.groups) {
                    if (planGroup._id.toString() === groupId) {
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
        return document.toObject<PlanDocument>();
    }

    async findPlanById(id: ObjectIdOrString): Promise<PlanDocument | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        return await PlanModel.findById(id).lean();
    }

    async findPlansByAccountId(accountId: ObjectIdOrString): Promise<Array<string>> {
        return await PlanModel.findByAccountId(accountId).lean();
    }

    async updatePlan(updatePlan: UpdatePlan): Promise<PlanDocument | null> {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { _id, accountId, ...plan } = updatePlan;
        if (!_id) {
            throw 'Plan ID is missing or invalid.';
        }
        return await PlanModel.findOneAndUpdate(
            { _id, accountId },
            { $set: plan },
            { runValidators: true, new: true }
        ).lean();
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

    async findPlanGroupingByAccountId(accountId: ObjectIdOrString): Promise<PlanGroupingDocument | null> {
        const document = await MasterAccountModel.findPlanGroupingById(accountId).lean();
        if (!document) {
            return null;
        }
        return document.planGrouping;
    }

    async updatePlanGrouping(updatePlanGrouping: UpdatePlanGrouping): Promise<PlanGroupingDocument | null> {
        const { accountId, ...planGrouping } = updatePlanGrouping;
        const document = await MasterAccountModel.findOneAndUpdate(
            { _id: accountId },
            { $set: { planGrouping } },
            { runValidators: true, new: true, projection: MasterAccountModel.PlanGroupingProjection }
        ).lean();
        if (!document) {
            return null;
        }
        return document.planGrouping;
    }

    async createPlanGroup(createPlanGroup: CreatePlanGroup): Promise<PlanGrouping | null> {
        const { accountId, ...planGroup } = createPlanGroup;
        const document = await MasterAccountModel.findOneAndUpdate(
            { _id: accountId },
            { $push: { 'planGrouping.groups': planGroup } },
            { runValidators: true, new: true, projection: MasterAccountModel.PlanGroupingProjection }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<MasterAccount>().planGrouping;
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
        const removedPlanIds: Array<ObjectId> = [];
        const updatedGroups: Array<PlanGroupDocument> = [];
        for (const planGroup of planGrouping.groups) {
            if (!targetPlanGroupIdSet.has(planGroup._id.toString())) {
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

    async syncPlanGroupingByAccountId(accountId: ObjectIdOrString): Promise<PlanGroupingDocument | null> {
        const planGrouping = await this.findPlanGroupingByAccountId(accountId);
        if (!planGrouping) {
            return null;
        }
        return await this._syncPlanGrouping(accountId, planGrouping);
    }

    async syncPlanGrouping(planGrouping: UpdatePlanGrouping<ObjectIdOrString, SerializableDate>): Promise<PlanGroupingDocument | null> {
        const planIds = await PlanModel.findPlanIdsByAccountId(planGrouping.accountId);
        const planIdSet = new Set(planIds.map(ObjectIdUtils.toString));
        const updatedGroups: Array<AnyPlanGroup> = [];
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

    private _syncPlanGrouping(accountId: ObjectIdOrString, planGrouping: PlanGroupingDocument): Promise<PlanGroupingDocument | null> {
        return this.syncPlanGrouping({
            accountId: accountId.toString(),
            ...planGrouping
        });
    }

    private _syncGroup(planGroup: AnyPlanGroup, planIdSet: Set<string>): void {
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
