import { BasicMasterAccount, MasterAccount, UpdateMasterAccount } from '@fgo-planner/data-core';
import { MasterAccountModel } from '@fgo-planner/data-mongo';
import { ObjectId } from 'bson';
import { Service } from 'typedi';

@Service()
export class MasterAccountService {

    // TODO Create DTO type for the account payload
    async createAccount(userId: ObjectId, account: Omit<MasterAccount, 'userId' | '_id'>): Promise<MasterAccount> {
        const document = await MasterAccountModel.create({
            ...account,
            userId
        });
        return document.toJSON<MasterAccount>();
    }

    async findById(id: ObjectId): Promise<MasterAccount | null> {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        const document = await MasterAccountModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<MasterAccount>();
    }

    async findByUserId(userId: ObjectId): Promise<Array<BasicMasterAccount>> {
        const documents = await MasterAccountModel.findByUserId(userId);
        return documents.map(doc => doc.toJSON<BasicMasterAccount>());
    }

    async update(account: UpdateMasterAccount): Promise<MasterAccount | null> {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        const document = await MasterAccountModel.partialUpdate(account);
        if (!document) {
            return null;
        }
        return document.toJSON<MasterAccount>();
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
        const document = await MasterAccountModel.exists({ _id: accountId, userId });
        return !!document;
    }

}
