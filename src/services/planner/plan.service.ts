import { BasicPlan, MasterAccountModel, Plan, PlanModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class PlanService {

    async addPlan(plan: Partial<Plan>): Promise<Plan> {
        return PlanModel.create(plan);
    }

    async findById(id: ObjectId): Promise<Plan | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        return PlanModel.findById(id).exec();
    }

    async findByAccountId(accountId: ObjectId): Promise<Array<BasicPlan>> {
        return PlanModel.findByAccountId(accountId).exec();
    }

    async update(plan: Partial<Plan>): Promise<Plan | null> {
        if (!plan._id) {
            throw 'Plan ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete plan.accountId;
        return PlanModel.findOneAndUpdate(
            { _id: plan._id },
            { $set: plan },
            { runValidators: true, new: true }
        ).exec();
    }

    async delete(id: ObjectId): Promise<boolean> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        const result = await PlanModel.deleteOne({ _id: id }).exec();
        return !!result.deletedCount;
    }

    /**
     * Removes plans from the given plan group ID by removing the `groupId`
     * references from the associated plans.
     */
    async removeFromGroup(groupId: ObjectId): Promise<any> {
        return await PlanModel.removeFromGroup(groupId);
    }

    /**
     * Checks whether the user is the owner of the  plan.
     * 
     * @param planId The plan ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(planId: ObjectId, userId: ObjectId): Promise<boolean> {
        // TODO Do this in a single db call
        const plan = await PlanModel.findById(planId, { accountId: 1 });
        if (!plan) {
            return false;
        }
        const account = await MasterAccountModel.findById(plan.accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }

}
