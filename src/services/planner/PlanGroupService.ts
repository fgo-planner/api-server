import { CollectionUtils, Functions } from '@fgo-planner/common-core';
import { BasicPlan, EntityUtils, PlanGroup, PlanGroupAggregatedData, PlanGroupDetails, PlanGroupDetailsAggregatedData } from '@fgo-planner/data-core';
import { MasterAccountModel, PlanGroupModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Inject, Service } from 'typedi';
import { PlanService } from './PlanService';

@Service()
export class PlanGroupService {

    @Inject()
    private _planService!: PlanService;

    async findById(id: ObjectId): Promise<PlanGroup | null> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        const document = await PlanGroupModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<PlanGroup>();
    }

    async findOrCreateForAccount(accountId: ObjectId): Promise<PlanGroup> {
        const documents = await PlanGroupModel.findByAccountId(accountId);
        if (documents.length) {
            return documents[0].toJSON<PlanGroup>();
        }
        const document = await PlanGroupModel.create({
            _id: accountId
        });
        return document.toJSON<PlanGroup>();
    }

    async findAggregatedByAccountId(accountId: ObjectId): Promise<PlanGroupAggregatedData> {
        const planGroup = await this.findOrCreateForAccount(accountId);
        const plans = await this._planService.findByAccountId(accountId);
        const planMap = CollectionUtils.mapIterableToMap(plans, EntityUtils.getIdString, Functions.identity);
        const groups: Array<PlanGroupDetailsAggregatedData> = [];
        for (const group of planGroup.groups) {
            const aggregatedGroup = this._aggregateGroupDetails(planMap, group);
            groups.push(aggregatedGroup);
        }
        const ungroupedPlans: Array<BasicPlan> = [];
        for (const planId of planGroup.ungroupedPlans) {
            const plan = planMap.get(planId);
            if (!plan) {
                continue;
            }
            ungroupedPlans.push(plan);
            planMap.delete(planId);
        }
        ungroupedPlans.push(...planMap.values());  // Push remaining plans
        return {
            accountId: accountId.toString(),
            ungroupedPlans,
            groups
        };
    }

    // FIXME
    async update(planGroup: Partial<PlanGroup>): Promise<PlanGroup | null> {
        if (!planGroup._id) {
            throw 'Plan group ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete planGroup.accountId;
        const document = await PlanGroupModel.findOneAndUpdate(
            { _id: planGroup._id },
            { $set: planGroup },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<PlanGroup>();
    }

    // FIXME
    async delete(id: ObjectId): Promise<boolean> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        const result = await PlanGroupModel.deleteOne({ _id: id });
        if (!result.deletedCount) {
            return false;
        }
        return true;
    }

    /**
     * Checks whether the user is the owner of the plan group.
     * 
     * @param planGroupId The plan group ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(planGroupId: ObjectId, userId: ObjectId): Promise<boolean> {
        // TODO Do this in a single db call
        const planGroup = await PlanGroupModel.findById(planGroupId, { accountId: 1 });
        if (!planGroup) {
            return false;
        }
        const account = await MasterAccountModel.findById(planGroup.accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }

    private _aggregateGroupDetails(planMap: Map<string, BasicPlan>, group: PlanGroupDetails): PlanGroupDetailsAggregatedData {
        const result: PlanGroupDetailsAggregatedData = {
            ...group,
            plans: []
        };
        for (const planId of group.plans) {
            const plan = planMap.get(planId);
            if (!plan) {
                continue;
            }
            result.plans.push(plan);
            planMap.delete(planId);
        }
        return result;
    }

}
