import { ObjectId } from 'bson';
import { UserGameAccountModel } from 'data/models';
import { UserGameAccount } from 'data/types';
import { Service } from 'typedi';

@Service()
export class UserGameAccountService {

    async addAccount(userId: ObjectId, account: UserGameAccount) {
        account.userId = userId;
        return UserGameAccountModel.create(account);
    }

    async findById(id: ObjectId) {
        if (!id) {
            throw 'Account ID is missing or invalid.';
        }
        return await UserGameAccountModel.findById(id).exec();
    }

    async findByUserId(userId: ObjectId) {
        return await UserGameAccountModel.findByUserId(userId);
    }

    async update(account: Partial<UserGameAccount>) {
        if (!account._id) {
            throw 'Account ID is missing or invalid.';
        }
        // Do not allow userId to be updated.
        delete account.userId;
        return await UserGameAccountModel.findOneAndUpdate(
            { _id: account._id },
            { $set: account },
            { runValidators: true, new: true }
        ).exec();
    }

    /**
     * Checks whether the user is the owner of the game account.
     * 
     * @param id The game account ID. Must not be null.
     * @param userId The user's ID. Must not be null.
     */
    async isOwner(id: ObjectId, userId: ObjectId) {
        // TODO Add null checks?
        const user = await UserGameAccountModel.findById(id, { userId: 1 });
        return userId.equals(user.userId);
    }

}
