import { BasicMasterAccount, MasterAccount, MasterAccountModel } from '@fgo-planner/data';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class MasterAccountService {

    async addAccount(userId: ObjectId, account: Omit<MasterAccount, 'userId' | '_id'>): Promise<MasterAccount> {
        (account as MasterAccount).userId = userId;
        return MasterAccountModel.create(account);
    }

    async findById(id: ObjectId): Promise<MasterAccount | null> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        return MasterAccountModel.findById(id).exec();
    }

    async findByUserId(userId: ObjectId): Promise<Array<BasicMasterAccount>> {
        return MasterAccountModel.findByUserId(userId);
    }

    async update(account: Partial<MasterAccount>): Promise<MasterAccount | null> {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        // Do not allow userId to be updated.
        delete account.userId;
        return MasterAccountModel.findOneAndUpdate(
            { _id: account._id },
            { $set: account },
            { runValidators: true, new: true }
        ).exec();
    }

    async delete(id: ObjectId): Promise<boolean> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        const result = await MasterAccountModel.deleteOne({ _id: id }).exec();
        return !!result.deletedCount;
    }

    /**
     * Checks whether the user is the owner of the master account.
     * 
     * @param accountId The master account ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(accountId: ObjectId, userId: ObjectId): Promise<boolean> {
        const account = await MasterAccountModel.findById(accountId, { userId: 1 });
        return account ? userId.equals(account.userId) : false;
    }

}
