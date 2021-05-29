import { MasterAccountValidators, UserDocument, UserModel, UserPreferences } from '@fgo-planner/data';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'bson';
import { Nullable } from 'internal';
import { Inject, Service } from 'typedi';
import { MasterAccountService } from '../master/master-account.service';

type BasicUserDocument = Pick<UserDocument, '_id' | 'username' | 'email'>;

/** 
 * Handles retrieving and updating users (excluding administrative operations).
 */
@Service()
export class UserService {

    private static readonly _BcryptStrength = Number(process.env.BCRYPT_STRENGTH) || 4;

    private static readonly _BasicProjection = {
        username: 1,
        email: 1
    };

    @Inject()
    private _masterAccountService!: MasterAccountService;

    async findById(id: ObjectId): Promise<UserDocument | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        return UserModel.findById(id).exec();
    }

    async findByIdBasic(id: ObjectId): Promise<BasicUserDocument | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        return UserModel.findById(id, UserService._BasicProjection).exec();
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
        return UserModel.exists({ username });
    }

    /**
     * Checks if the email address is in use by another registered user.
     */
    async emailExists(email?: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        return UserModel.exists({ email });
    }

    async getUserPreferences(userId: ObjectId): Promise<UserPreferences | null> {
        return UserModel.getUserPreferences(userId);
    }

    async updateUserPreferences(userId: ObjectId, userPrefs: Partial<UserPreferences>): Promise<UserPreferences | null> {
        const updateObject: Record<string, any> = {};
        for (const [key, value] of Object.entries(userPrefs)) {
            updateObject[`userPrefs.${key}`] = value;
        }
        
        const user = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $set: updateObject },
            { runValidators: true, new: true }
        ).exec();

        return user && user.userPrefs;
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
