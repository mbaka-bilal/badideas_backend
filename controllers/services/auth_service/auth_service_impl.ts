import { SignupInterface } from '../../../models/interface/auth_interface';
import AuthService from './auth_service';
import { UserProfileInterface } from '../../../models/interface/user_profile_interface';
import { UserRecordsDBService } from '../db_service/user_records_db_service';
import bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import { UserExits } from '../../../utils/exceptions/profile_exceptions';
import Helpers from '../../../utils/helpers';
import sendMail from '../mail_service/send_mail';


export class AuthServiceImpl implements AuthService {
    dbService: UserRecordsDBService;

    constructor(dbService: UserRecordsDBService) {
        this.dbService = dbService;
        this.signup = this.signup.bind(this);
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

            const password = await bcrypt.hash(data.password, 10);

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

}

export default AuthService;