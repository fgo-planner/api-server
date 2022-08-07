import { BasicPlanGroup, MasterAccountModel, PlanGroup, PlanGroupModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { PlanService } from 'services';
import Container, { Service } from 'typedi';

@Service()
export class PlanGroupService {

    private _planService = Container.get(PlanService);

    async addPlanGroup(planGroup: Partial<PlanGroup>): Promise<PlanGroup> {
        const result = await PlanGroupModel.create(planGroup);
        return result.toObject();
    }

    async findById(id: ObjectId): Promise<PlanGroup | null> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        const result = await PlanGroupModel.findById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findByAccountId(accountId: ObjectId): Promise<Array<BasicPlanGroup>> {
        const result = await PlanGroupModel.findByAccountId(accountId);
        return result.map(doc => doc.toObject());
    }

    async update(planGroup: Partial<PlanGroup>): Promise<PlanGroup | null> {
        if (!planGroup._id) {
            throw 'Plan group ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete planGroup.accountId;
        const result = await PlanGroupModel.findOneAndUpdate(
            { _id: planGroup._id },
            { $set: planGroup },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async delete(id: ObjectId): Promise<boolean> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        const result = await PlanGroupModel.deleteOne({ _id: id });
        if (!result.deletedCount) {
            return false;
        }
        await this._planService.removeFromGroup(id);
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

}
