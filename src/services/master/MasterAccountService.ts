import { MasterAccount, UpdateMasterAccount } from '@fgo-planner/data-core';
import { MasterAccountBasicDocument, MasterAccountDocument, MasterAccountModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class MasterAccountService {

    // TODO Create DTO type for the account payload
    async createAccount(userId: ObjectId, account: Omit<MasterAccount, 'userId' | '_id'>): Promise<MasterAccountDocument> {
        const document = await MasterAccountModel.create({
            ...account,
            userId
        });
        return document.toObject<MasterAccountDocument>();
    }

    async findById(id: ObjectId): Promise<MasterAccountDocument | null> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        return await MasterAccountModel.findById(id).lean();
    }

    async findByUserId(userId: ObjectId): Promise<Array<MasterAccountBasicDocument>> {
        return await MasterAccountModel.findByUserId(userId).lean();
    }

    async update(account: UpdateMasterAccount): Promise<MasterAccountDocument | null> {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        return await MasterAccountModel.partialUpdate(account);
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
     * @param userId The user's ID. Must not be null.
     * @param accountId The master account ID. Must not be null.
     */
    async isOwner(userId: ObjectId | string, accountId: ObjectId | string): Promise<boolean> {
        const document = await MasterAccountModel.exists({ _id: accountId, userId }).lean();
        return !!document;
    }

}
