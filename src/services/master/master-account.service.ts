import { BasicMasterAccount, MasterAccount, MasterAccountModel, MasterAccountUpdate, MasterServantUtils } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class MasterAccountService {

    async addAccount(userId: ObjectId, account: Omit<MasterAccount, 'userId' | '_id'>): Promise<MasterAccount> {
        (account as MasterAccount).userId = userId;
        const result = await MasterAccountModel.create(account);
        return result.toObject();
    }

    async findById(id: ObjectId): Promise<MasterAccount | null> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        const result = await MasterAccountModel.findById(id);
        if (!result) {
            return null;
        }

        /**
         * Temporary, for backwards compatibility with old data.
         * 
         * TODO Remove this.
         */
        if (result.lastServantInstanceId == null) {
            result.lastServantInstanceId = MasterServantUtils.getLastInstanceId(result.servants);
        }

        return result.toObject();
    }

    async findByUserId(userId: ObjectId): Promise<Array<BasicMasterAccount>> {
        const result = await MasterAccountModel.findByUserId(userId);
        return result.map(doc => doc.toObject());
    }

    async update(account: MasterAccountUpdate): Promise<MasterAccount | null> {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        const result = await MasterAccountModel.partialUpdate(account);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async delete(id: ObjectId): Promise<boolean> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        const result = await MasterAccountModel.deleteOne({ _id: id });
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
