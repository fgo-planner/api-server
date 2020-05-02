import { GameAccountModel } from 'data/models';
import { GameAccount } from 'data/types';
import { Service } from 'typedi';

@Service()
export class GameAccountService {

    async addAccount(userId: string, account: GameAccount) {
        delete account._id;
        account.userId = userId;
        return GameAccountModel.create(account);
    }

    async findByUserId(userId: string) {
        return await GameAccountModel.find({ userId });
    }

}
