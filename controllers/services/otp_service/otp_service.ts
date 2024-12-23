import { UserProfileInterface } from "../../../models/interface/user_profile_interface";
import { UserRecordsDBService } from "../db_service/user_records_db_service";

export abstract class OtpService {
    dbService: UserRecordsDBService;

    constructor(dbService: UserRecordsDBService) {
        this.dbService = dbService;
    }


    abstract sendOtp(email: string): Promise<boolean>;
    abstract verifyOtp(otp: string, email: string): Promise<UserProfileInterface>;
}