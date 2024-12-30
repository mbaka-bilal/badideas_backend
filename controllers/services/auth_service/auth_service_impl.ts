import { SignupInterface } from '../../../models/interface/auth_interface';
import AuthService from './auth_service';
import { UserProfileInterface } from '../../../models/interface/user_profile_interface';
import { UserRecordsDBService } from '../db_service/user_records/user_records_db_service';
import { v4 } from 'uuid';
import { IncorrectPassword, UserExits, UserNotFound } from '../../../utils/exceptions/profile_exceptions';
import Helpers from '../../../utils/helpers';
import sendMail from '../mail_service/send_mail';
import { Constants } from '../../../utils/constants';


export class AuthServiceImpl implements AuthService {
    dbService: UserRecordsDBService;

    constructor(dbService: UserRecordsDBService) {
        this.dbService = dbService;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }


    async login(email: string, password: string): Promise<UserProfileInterface> {

        try {

            const user = await this.dbService.fetchUser({
                email: email,
            });

            if (user == null) throw new UserNotFound(Constants.kUserNotFound);

            if ((await Helpers.comparePassword(password, user.password!)) == false) {
                throw new IncorrectPassword();
            }

            const accessToken = Helpers.generateFreshTokens(user.uid, user.userName, user.email);

            return await this.dbService.updateProfile({
                uid: user.uid,
                accessToken: accessToken[0],
                refreshToken: accessToken[1],
            });
        } catch (e) {
            throw e;
        }
    }

    async signup(data: SignupInterface): Promise<UserProfileInterface> {
        try {
            const user = await this.dbService.fetchUser({
                email: data.email,
                userName: data.userName,
            });

            console.log(`user found ${JSON.stringify(user)}`);

            if (user != null) {
                if (user.email == data.email) {
                    throw new UserExits("User with email exists");
                }
                if (user.userName == data.userName) {
                    throw new UserExits("username taken");
                }
                throw new UserExits("User with the same record exists");
            }

            const password = await Helpers.hashPassword(data.password);

            const otp = Helpers.generateOtp();



            const userProfile = await this.dbService.createUser({
                email: data.email,
                uid: `${v4()}_${data.email}`,
                userName: data.userName,
                createdAt: new Date().toISOString(),
                password: password,
                verified: false,
                otp: otp,
            });

            sendMail([data.email], "Otp", otp);

            return userProfile;


        } catch (e) {
            throw e;
        }
    }

    async resetPassword(otp: string, password: string, email: string): Promise<UserProfileInterface> {
        try {
            const user = await this.dbService.fetchUser({
                email: email,
            });

            if (user == null) throw new UserNotFound();

            if (user.otp !== otp) throw new Error("Incorrect otp");

            const accessToken = Helpers.generateFreshTokens(user.uid, user.userName, user.email);

            return await this.dbService.updateProfile({
                uid: user.uid,
                password: await Helpers.hashPassword(password),
                accessToken: accessToken[0],
                refreshToken: accessToken[1],
            });


        } catch (e) {
            throw e;
        }
    }

    async refreshToken(refreshToken: string,): Promise<UserProfileInterface> {
        try {
            const user = await this.dbService.fetchUser({
                refreshToken: refreshToken,
            });

            if (user == null) throw new UserNotFound();

            const accessToken = Helpers.generateFreshTokens(user.uid, user.userName, user.email);

            return await this.dbService.updateProfile({
                uid: user.uid,
                accessToken: accessToken[0],
                refreshToken: accessToken[1],
            });


        } catch (e) {
            throw e;
        }
    }

    async changePassword(uid: string, oldPassword: string, newPassword: string): Promise<UserProfileInterface> {
        try {
            const user = await this.dbService.fetchUser({
                id: uid,
            });

            if (user == null) throw new UserNotFound();
            if ((await Helpers.comparePassword(oldPassword, user.password!)) == false) throw new IncorrectPassword();
            if ((await Helpers.comparePassword(newPassword, user.password!)) == true) throw new Error("New password cannot be same as old password");

            const accessToken = Helpers.generateFreshTokens(user.uid, user.userName, user.email);

            return await this.dbService.updateProfile({
                uid: user.uid,
                accessToken: accessToken[0],
                refreshToken: accessToken[1],
                password: await Helpers.hashPassword(newPassword),
            });


        } catch (e) {
            throw e;
        }
    }


}

export default AuthService;