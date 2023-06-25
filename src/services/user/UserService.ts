import { Nullable } from '@fgo-planner/common-core';
import { BasicUser, User, UserPreferences } from '@fgo-planner/data-core';
import { MasterAccountValidators, UserDbDocument, UserModel } from '@fgo-planner/data-mongo';
import bcrypt from 'bcryptjs';
import { ObjectId } from 'bson';
import { Inject, Service } from 'typedi';
import { MasterAccountService } from '../master/MasterAccountService';

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
        const document = await UserModel.findById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<User>();
    }

    async findBasicById(id: ObjectId): Promise<BasicUser | null> {
        if (!id) {
            throw 'User ID is missing or invalid.';
        }
        const document = await UserModel.findBasicById(id);
        if (!document) {
            return null;
        }
        return document.toJSON<BasicUser>();
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
            await this._masterAccountService.createAccount(user._id, {
                friendId,
                resources: {
                    items: [],
                    embers: {},
                    qp: 0
                },
                servants: {
                    servants: [],
                    lastServantInstanceId: 0,
                    bondLevels: {}
                },
                costumes: {
                    unlocked: [],
                    noCostUnlock: []
                },
                soundtracks: {
                    unlocked: []
                },
                planGrouping: {
                    ungrouped: [],
                    groups: []
                }
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
        const document = await UserModel.exists({ username });
        return !!document;
    }

    /**
     * Checks if the email address is in use by another registered user.
     */
    async emailExists(email?: string): Promise<boolean> {
        if (!email) {
            return false;
        }
        const document = await UserModel.exists({ email });
        return !!document;
    }

    async getUserPreferences(userId: ObjectId): Promise<UserPreferences | null> {
        const document = await UserModel.getUserPreferences(userId);
        if (!document) {
            return null;
        }
        return document.toJSON().userPrefs;
    }

    async updateUserPreferences(userId: ObjectId, userPrefs: Partial<UserPreferences>): Promise<UserPreferences | null> {
        const updateObject: Record<string, any> = {};
        for (const [key, value] of Object.entries(userPrefs)) {
            updateObject[`userPrefs.${key}`] = value;
        }
        const document = await UserModel.findOneAndUpdate<UserDbDocument>(
            { _id: userId },
            { $set: updateObject },
            { runValidators: true, new: true }
        );
        if (!document) {
            return null;
        }
        return document.toJSON().userPrefs;
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
        return MasterAccountValidators.isFriendIdFormatValidOrEmpty(friendId);
    }

    private _hashPassword(password: string): string {
        const salt = bcrypt.genSaltSync(UserService._BcryptStrength);
        return bcrypt.hashSync(password, salt);
    }

}
