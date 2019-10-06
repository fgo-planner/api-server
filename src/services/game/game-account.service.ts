import { GameAccount } from 'game/game-account.type';
import { Service } from 'typedi';
import { GameAccountModel } from '../../data/models/game/game-account.model';

@Service()
export class GameAccountService {

    async addAccount(userId: string, account: GameAccount) {
        account.userId = userId;
        if (!account.gameAccountId) {
            // TODO Validate ID range.
            throw 'Account ID is required.';
        }
        if (!account.gameRegion) {
            // TODO Validate game region
            throw 'Region is required.';
        }
        const asdf = await GameAccountModel.create(account);
        return asdf;
    }

    async findByUserId(userId: string) {
        return await GameAccountModel.find({ userId });
    }

}
