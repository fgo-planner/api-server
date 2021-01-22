import { ObjectId } from 'bson';
import { MasterAccountModel } from 'data/models';
import { MasterAccount } from 'data/types';
import { Service } from 'typedi';

@Service()
export class MasterAccountService {

    async addAccount(userId: ObjectId, account: MasterAccount): Promise<MasterAccount> {
        account.userId = userId;
        return MasterAccountModel.create(account);
    }

    async findById(id: ObjectId): Promise<MasterAccount> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        return await MasterAccountModel.findById(id).exec();
    }

    async findByUserId(userId: ObjectId): Promise<Partial<MasterAccount>[]> {
        return await MasterAccountModel.findByUserId(userId);
    }

    async update(account: Partial<MasterAccount>): Promise<MasterAccount> {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        // Do not allow userId to be updated.
        delete account.userId;
        return await MasterAccountModel.findOneAndUpdate(
            { _id: account._id },
            { $set: account },
            { runValidators: true, new: true }
        ).exec();
    }

    /**
     * Checks whether the user is the owner of the master account.
     * 
     * @param id The master account ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(id: ObjectId, userId: ObjectId): Promise<boolean> {
        // TODO Add null checks?
        const user = await MasterAccountModel.findById(id, { userId: 1 });
        return userId.equals(user.userId);
    }

}
