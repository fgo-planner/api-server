import { BasicPlan, BasicPlanGroup, BasicPlans, EntityUtils, MasterAccountModel, PlanList, PlanListItem, PlanListModel, PlanListPlanItem, PlanType } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { PlanGroupService, PlanService } from 'services';
import Container, { Service } from 'typedi';

@Service()
export class PlanListService {

    private _planService = Container.get(PlanService);

    private _planGroupService = Container.get(PlanGroupService);

    async findById(id: ObjectId): Promise<PlanList | null> {
        if (!id) {
            throw 'Plan list ID is missing or invalid.';
        }
        const document = await PlanListModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toObject();
    }

    async findOrCreateByAccountId(accountId: ObjectId): Promise<BasicPlans<ObjectId>> {
        const plans = await this._planService.findByAccountId(accountId);
        const planGroups = await this._planGroupService.findByAccountId(accountId);
        const documents = await PlanListModel.findByAccountId(accountId);
        let planList: PlanList;
        if (documents.length) {
            const document = documents[0].toObject();
            const updateRequired = this._syncList(document.list, plans, planGroups);
            if (updateRequired) {
                planList = await this.update(document) || document;
            } else {
                planList = document;
            }
        } else {
            const newPlanList: Partial<PlanList> = {
                accountId,
                list: [
                    ...plans.map(this._planToPlanListItem),
                    ...planGroups.map(this._groupToPlanListItem)
                ]
            };
            const document = await PlanListModel.create(newPlanList);
            planList = document.toObject();
        }
        return {
            plans,
            planGroups,
            planList
        };
    }

    async update(planList: Partial<PlanList>): Promise<PlanList | null> {
        if (!planList._id) {
            throw 'Plan list ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete planList.accountId;
        const document = await PlanListModel.findOneAndUpdate(
            { _id: planList._id },
            { $set: planList },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toObject();
    }

    /**
     * Checks whether the user is the owner of the plan list.
     * 
     * @param planListId The plan list ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(planListId: ObjectId, userId: ObjectId): Promise<boolean> {
        // TODO Do this in a single db call
        const planList = await PlanListModel.findById(planListId, { accountId: 1 });
        if (!planList) {
            return false;
        }
        const account = await MasterAccountModel.findById(planList.accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }

    private _planToPlanListItem(plan: BasicPlan): PlanListItem {
        return {
            type: PlanType.Plan,
            refId: plan._id
        };
    }

    private _groupToPlanListItem(group: BasicPlanGroup): PlanListItem {
        return {
            type: PlanType.Group,
            refId: group._id,
            children: []
        };
    }

    /**
     * Synchronizes the given list with the current plans and plan groups.
     *
     * @returns `true` if changes were made during the synchronization, `false`
     * otherwise.
     */
    private _syncList(list: Array<PlanListItem>, plans: Array<BasicPlan>, planGroups: Array<BasicPlanGroup>): boolean {
        if (!list.length) {
            list.push(...plans.map(this._planToPlanListItem));
            list.push(...planGroups.map(this._groupToPlanListItem));
            return true;
        }
        let hasChanges = false;
        const planIdSet = new Set(plans.map(EntityUtils.getIdString));
        const planGroupIdSet = new Set(planGroups.map(EntityUtils.getIdString));
        const updatedList: Array<PlanListItem> = [];
        for (const item of list) {
            const id = item.refId.toString();
            if (item.type === PlanType.Group) {
                if (!planGroupIdSet.delete(id)) {
                    hasChanges = true;
                    continue;
                }
                const updatedChildren: Array<PlanListPlanItem<ObjectId>> = [];
                for (const child of item.children) {
                    if (!planIdSet.delete(child.refId.toString())) {
                        hasChanges = true;
                        continue;
                    }
                    updatedChildren.push(child);
                }
                updatedList.push(item);
            } else {
                if (!planIdSet.delete(id)) {
                    hasChanges = true;
                    continue;
                }
                updatedList.push(item);
            }
        }
        for (const planGroupId of planGroupIdSet) {
            updatedList.push({
                type: PlanType.Group,
                refId: new ObjectId(planGroupId),
                children: []
            });
            hasChanges = true;
        }
        for (const planId of planIdSet) {
            updatedList.push({
                type: PlanType.Plan,
                refId: new ObjectId(planId)
            });
            hasChanges = true;
        }
        if (hasChanges) {
            list.splice(0, list.length);
            list.push(...updatedList);
        }
        return hasChanges;
    }

    // private _getIdString({ _id: }

}
