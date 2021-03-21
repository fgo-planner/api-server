import { MasterAccountValidators, UserDocument, UserModel } from '@fgo-planner/data';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'bson';
import { Nullable } from 'internal';
import { Inject, Service } from 'typedi';
import { MasterAccountService } from '../master/master-account.service';

/** 
 * Handles retrieving and updating users (excluding administrative operations).
 */
@Service()
export class UserService {

    private static readonly _BcryptStrength = Number(process.env.BCRYPT_STRENGTH) || 4;

    @Inject()
    private _masterAccountService!: MasterAccountService;

    // TODO Remove this
    test(id: string, status: boolean) {
        UserModel.setAdminStatus(id, status, (err, doc) => {
            console.log(doc);
        });
    }

    async findById(id: ObjectId): Promise<UserDocument | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        return await UserModel.findById(id).exec();
    }

    async findByIdBasic(id: ObjectId): Promise<UserDocument | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        const projection = {
            _id: 0,
            hash: 0,
            admin: 0,
            enabled: 0,
            createdAt: 0,
            updatedAt: 0
        };
        return await UserModel.findById(id, projection).exec();
    }

    // TODO Create DTO for parameters if it gets too big.
    async register(username: string, password: string, email?: string, friendId?: string): Promise<void> {
        username = username.trim();
        email = email?.trim() || undefined;

        if (!username) {
            throw 'Username is required';
        }
        if (!this._passwordIsValid(password)) {
            throw 'Invalid password';
        }
        if (!this._emailIsValid(email)) {
            throw 'Invalid email address';
        }
        if (!this._friendIdIsValid(friendId)) {
            throw 'Invalid friend Id';
        }
        if (await this.usernameExists(username)) {
            throw 'Username is already in use';
        }
        if (await this.emailExists(email)) {
            throw 'Email is already in use';
        }

        const user = await UserModel.create({
            username,
            email,
            hash: this._hashPassword(password)
        });

        if (friendId) {
            await this._masterAccountService.addAccount(user._id, {
                friendId,
                qp: 0,
                items: [],
                servants: []
            });
        }
    }

    /**
     * Checks if the username is already in use by another registered user.
     */
    async usernameExists(username: string): Promise<boolean> {
        return await UserModel.exists({ username });
    }

    /**
     * Checks if the email address is in use by another registered user.
     */
    async emailExists(email?: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        return await UserModel.exists({ email });
    }

    private _passwordIsValid(password: string): boolean {
        // TODO Implement this.
        return !!password;
    }

    private _emailIsValid(email?: string): boolean {
        // TODO Implement this.
        return true;
    }

    private _friendIdIsValid(friendId: Nullable<string>): boolean {
        // TODO Implement this.
        return MasterAccountValidators.isFriendIdFormalValidOrEmpty(friendId);
    }

    private _hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(UserService._BcryptStrength);
        return bcrypt.hashSync(password, salt);
    }

}