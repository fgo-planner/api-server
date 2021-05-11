import { MasterAccountModel, MasterPlan, MasterPlanModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class MasterPlanService {

    async addPlan(plan: Partial<MasterPlan>): Promise<MasterPlan> {
        return MasterPlanModel.create(plan);
    }

    async findById(id: ObjectId): Promise<MasterPlan | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        return MasterPlanModel.findById(id).exec();
    }

    async findByAccountId(accountId: ObjectId): Promise<Partial<MasterPlan>[]> {
        return MasterPlanModel.findByAccountId(accountId);
    }

    async update(plan: Partial<MasterPlan>): Promise<MasterPlan | null> {
        if (!plan._id) {
            throw 'Plan ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete plan.accountId;
        return MasterPlanModel.findOneAndUpdate(
            { _id: plan._id },
            { $set: plan },
            { runValidators: true, new: true }
        ).exec();
    }

    async delete(id: ObjectId): Promise<MasterPlan | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        return MasterPlanModel.deleteOne({ _id: id }).exec();
    }

    /**
     * Checks whether the user is the owner of the master plan.
     * 
     * @param planId The master plan ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(planId: ObjectId, userId: ObjectId): Promise<boolean> {
        // TODO Do this in one db call
        const plan = await MasterPlanModel.findById(planId, { accountId: 1 });
        if (!plan) {
            return false;
        }
        const account = await MasterAccountModel.findById(plan.accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }
}
