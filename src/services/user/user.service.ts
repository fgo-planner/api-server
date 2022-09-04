import { BasicUser, MasterAccountValidators, User, UserModel, UserPreferences } from '@fgo-planner/data-mongo';
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

    async findById(id: ObjectId): Promise<User | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        const result = await UserModel.findById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
    }

    async findBasicById(id: ObjectId): Promise<BasicUser | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        const result = await UserModel.findBasicById(id);
        if (!result) {
            return null;
        }
        return result.toObject();
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
                resources: {
                    items: [],
                    embers: {},
                    qp: 0
                },
                servants: [],
                costumes: [],
                bondLevels: {},
                soundtracks: []
            });
        }
    }

    /**
     * Checks if the username is already in use by another registered user.
     */
    async usernameExists(username: string): Promise<boolean> {
        if (!username) {
            return false;
        }
        const result = await UserModel.exists({ username });
        return !!result;
    }

    /**
     * Checks if the email address is in use by another registered user.
     */
    async emailExists(email?: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        const result = await UserModel.exists({ email });
        return !!result;
    }

    async getUserPreferences(userId: ObjectId): Promise<UserPreferences | null> {
        return UserModel.getUserPreferences(userId);
    }

    async updateUserPreferences(userId: ObjectId, userPrefs: Partial<UserPreferences>): Promise<UserPreferences | null> {
        const updateObject: Record<string, any> = {};
        for (const [key, value] of Object.entries(userPrefs)) {
            updateObject[`userPrefs.${key}`] = value;
        }
        const result = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: updateObject },
            { runValidators: true, new: true }
        );
        if (!result) {
            return null;
        }
        return result.userPrefs;
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
