

import { UserProfileInterface } from "../../../models/interface/user_profile_interface";
import { Constants } from "../../../utils/constants";
import { UserNotFound } from "../../../utils/exceptions/profile_exceptions";
import Helpers from "../../../utils/helpers";
import { UserRecordsDBService } from "../db_service/user_records_db_service";
import sendMail from "../mail_service/send_mail";
import { OtpService } from "./otp_service";

export class OtpServiceImpl implements OtpService {
    dbService: UserRecordsDBService;


    constructor(dbService: UserRecordsDBService) {
        this.dbService = dbService;
    }


    async sendOtp(email: string): Promise<boolean> {
        try {
            const otp = Helpers.generateOtp();
            const user = await this.dbService.fetchUser({ email: email });
            if (user == null) throw new UserNotFound()

            await this.dbService.updateProfile({ uid: user.uid, otp: otp });

            return await sendMail([email], "OTP", otp).then(() => {
                return true;
            });

        } catch (e) {
            //TODO handle exception.
            throw e;
        }
    }

    async verifyOtp(otp: string, email: string): Promise<UserProfileInterface> {
        try {
            const user = await this.dbService.fetchUser({ email: email });
            if (user == null) throw new UserNotFound()
            if (user.otp == null) throw Error(Constants.kServerError);
            if (user.otp == otp) {

                const tokens = Helpers.generateFreshTokens(user.uid, user.userName, user.email);

                return await this.dbService.updateProfile({
                    uid: user.uid,
                    verified: true,
                    accessToken: tokens[0],
                    refreshToken: tokens[1]
                });
            } else {
                throw Error("Incorrect otp");
            }
        } catch (e) {
            //TODO handle exception
            throw e;
        }
    }



}