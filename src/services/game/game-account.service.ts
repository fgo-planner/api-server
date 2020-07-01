import { UserGameAccountModel } from 'data/models';
import { UserGameAccount } from 'data/types';
import { Service } from 'typedi';

@Service()
export class UserGameAccountService {

    async addAccount(userId: string, account: UserGameAccount) {
        account.userId = userId;
        const _account = new UserGameAccountModel(account);
        const errors = _account.validateSync();
        if (errors) {
            throw errors;
        }
        return _account;

        // delete account._id;
        // return UserGameAccountModel.create(account);
    }

    async findByUserId(userId: string) {
        return await UserGameAccountModel.find({ userId });
    }

}
