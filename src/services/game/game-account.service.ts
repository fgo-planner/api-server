import { GameAccountModel } from 'data/models';
import { GameAccount } from 'data/types';
import { Service } from 'typedi';

@Service()
export class GameAccountService {

    async addAccount(userId: string, account: GameAccount) {
        account.userId = userId;
        const _account = new GameAccountModel(account);
        const errors = _account.validateSync();
        if (errors) {
            throw errors;
        }
        return _account;

        // delete account._id;
        // return GameAccountModel.create(account);
    }

    async findByUserId(userId: string) {
        return await GameAccountModel.find({ userId });
    }

}
