import { UserProfileInterface } from "../../../models/interface/user_profile_interface";

export abstract class UserRecordsDBService {
    abstract fetchUser(param: {
        email?: string | null,
        userName?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        id?: string | null
    }): Promise<UserProfileInterface | null>;
    abstract createUser(userDetails: any): Promise<UserProfileInterface>;
    abstract updateProfile(data: {
        uid: string,
        email?: string | null,
        verified?: boolean | null,
        otp?: string | null,
        userName?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        password?: string | null
    }): Promise<UserProfileInterface>;
}