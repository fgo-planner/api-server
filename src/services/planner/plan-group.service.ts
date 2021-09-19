import { MasterAccountModel, PlanGroup, PlanGroupModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { PlanService } from 'services';
import Container, { Service } from 'typedi';

@Service()
export class PlanGroupService {

    private _planService = Container.get(PlanService);

    async addPlanGroup(planGroup: Partial<PlanGroup>): Promise<PlanGroup> {
        return PlanGroupModel.create(planGroup);
    }

    async findById(id: ObjectId): Promise<PlanGroup | null> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        return PlanGroupModel.findById(id).exec();
    }

    async findByAccountId(accountId: ObjectId): Promise<Partial<PlanGroup>[]> {
        return PlanGroupModel.findByAccountId(accountId);
    }

    async update(planGroup: Partial<PlanGroup>): Promise<PlanGroup | null> {
        if (!planGroup._id) {
            throw 'Plan group ID is missing or invalid.';
        }
        // Do not allow accountId to be updated.
        delete planGroup.accountId;
        return PlanGroupModel.findOneAndUpdate(
            { _id: planGroup._id },
            { $set: planGroup },
            { runValidators: true, new: true }
        ).exec();
    }

    async delete(id: ObjectId): Promise<PlanGroup | null> {
        if (!id) {
            throw 'Plan group ID is missing or invalid.';
        }
        const group = await PlanGroupModel.deleteOne({ _id: id }).exec();
        await this._planService.removeFromGroup(id);
        return group;
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
