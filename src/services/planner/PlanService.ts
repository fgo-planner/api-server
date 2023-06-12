import { BasicPlan, Plan } from '@fgo-planner/data-core';
import { MasterAccountModel, PlanModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { DeleteResult } from 'mongodb';
import { Service } from 'typedi';

@Service()
export class PlanService {

    async addPlan(plan: Partial<Plan>): Promise<Plan> {
        const document = await PlanModel.create(plan);
        return document.toJSON<Plan>();
    }

    async findById(id: ObjectId): Promise<Plan | null> {
        if (!id) {
            throw 'Plan ID is missing or invalid.';
        }
        const document = await PlanModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<Plan>();
    }

    async findByAccountId(accountId: ObjectId): Promise<Array<BasicPlan>> {
        const documents = await PlanModel.findByAccountId(accountId);
        return documents.map(document => document.toJSON<BasicPlan>());
    }

    async update(plan: Partial<Plan>): Promise<Plan | null> {
        if (!plan._id) {
            throw 'Plan ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete plan.accountId;
        const document = await PlanModel.findOneAndUpdate(
            { _id: plan._id },
            { $set: plan },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON<Plan>();
    }

    async delete(id: ObjectId): Promise<number>;
    async delete(ids: Array<ObjectId>): Promise<number>;
    async delete(ids: ObjectId | Array<ObjectId>): Promise<number> {
        let result: DeleteResult;
        if (Array.isArray(ids)) {
            if (!ids.length) {
                return 0;
            }
            result = await PlanModel.deleteMany({ _id: { $in: ids } });
        } else {
            if (!ids) {
                throw 'Plan ID is missing or invalid.';
            }
            result = await PlanModel.deleteOne({ _id: ids });
        }
        return result.deletedCount;
    }

    /**
     * Checks whether the user is the owner of the plan.
     * 
     * @param planId The plan ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(planId: ObjectId | string, userId: ObjectId): Promise<boolean> {
        // TODO Do this in a single db call
        const plan = await PlanModel.findById(planId, { accountId: 1 });
        if (!plan) {
            return false;
        }
        const account = await MasterAccountModel.findById(plan.accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }

}
