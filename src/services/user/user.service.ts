import bcrypt from 'bcryptjs';
import { UserModel } from 'data/models';
import { Service } from 'typedi';

/** 
 * Handles retriving and updating users (excluding adminstrative operations).
 */
@Service()
export class UserService {

    private readonly _bcryptStrength = Number(process.env.BCRYPT_STRENGTH) || 4;

    test(id: string, status: boolean) {
        UserModel.setAdminStatus(id, status, (err, doc) => {
            console.log(doc);
        });
    }

    // TODO Create DTO for parameters if it gets too big.
    async register(username: string, email: string, password: string) {
        if (!username) {
            throw 'Username is required';
        }
        if (!this._passwordIsValid(password)) {
            throw 'Invalid password';
        }
        if (!this._emailIsValid(email)) {
            throw 'Invalid email address';
        }
        if (await this.usernameExists(username)) {
            throw 'Username is already in use';
        }
        if (await this.emailExists(email)) {
            throw 'Email is already in use';
        }
        UserModel.create({
            username,
            email,
            hash: this._hashPassword(password)
        });
    }

    /**
     * Checks if the username is already in use by another registered user.
     */
    async usernameExists(username: string) {
        return await UserModel.exists({ username });
    }

    /**
     * Checks if the email address is in use by another registered user.
     */
    async emailExists(email: string) {
        return await UserModel.exists({ email });
    }

    private _passwordIsValid(password: string) {
        // TODO Implement this.
        return !!password;
    }

    private _emailIsValid(email: string) {
        // TODO Implement this.
        return !!email;
    }

    private _hashPassword(password: string) {
        const salt = bcrypt.genSaltSync(this._bcryptStrength);
        return bcrypt.hashSync(password, salt);
    }

}