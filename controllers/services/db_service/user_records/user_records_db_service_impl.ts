import { Filter, getFirestore } from 'firebase-admin/firestore';
import { UserProfileInterface } from "../../../../models/interface/user_profile_interface";
import { UserRecordsDBService } from "./user_records_db_service";
import { app } from '../../../../config/firebase';
import { Constants } from '../../../../utils/constants';
import printAndAddToLog from '../../../../utils/helpers';
import Helpers from '../../../../utils/helpers';

export class UserRecordsDBServiceImpl implements UserRecordsDBService {
    private db = getFirestore(app);

    async fetchUser(param: {
        email?: string | null,
        userName?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        id?: string | null,
    }): Promise<UserProfileInterface | null> {
        try {
            const filters = this.createFilters(param);

            const querysnapshot = await this.db.collection(Constants.kUsersCollection)
                .where(Filter.or(...filters)).get();
            const documents = querysnapshot.docs;



            if (documents.length === 0) {
                return null;
            }
            if (documents.length > 1) {
                throw new Error(Constants.kServerError);
            }

            const data = documents[0].data()!;

            return Helpers.documentDataToProfileData(data);
        } catch (e) {
            Helpers.printAndAddToLog(`${e}`);
            throw new Error("Error occurred while fetching user");
        }
    }

    private createFilters(param: {
        email?: string | null,
        userName?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null,
        id?: string | null
    }): Filter[] {
        const filters: Filter[] = [];

        if (param.email) {
            filters.push(Filter.where("email", "==", param.email));
        }
        if (param.userName) {
            filters.push(Filter.where("userName", "==", param.userName));
        }
        if (param.accessToken) {
            filters.push(Filter.where("accessToken", "==", param.accessToken));
        }
        if (param.refreshToken) {
            filters.push(Filter.where("refreshToken", "==", param.refreshToken));
        }
        if (param.id) {
            filters.push(Filter.where("uid", "==", param.id));
        }

        return filters;
    }

    async createUser(userDetails: UserProfileInterface): Promise<UserProfileInterface> {
        try {
            await this.db.collection(Constants.kUsersCollection).doc(userDetails.uid).set(userDetails);
            return userDetails;
        } catch (e) {
            Helpers.printAndAddToLog(`${e}`);
            throw new Error("Error occurred while creating user");
        }
    }

    async updateProfile(data: {
        uid: string,
        verified?: boolean | null,
        password: string | null,
        email?: string | null,
        otp?: string | null,
        userName?: string | null,
        accessToken?: string | null,
        refreshToken?: string | null
    }): Promise<UserProfileInterface> {
        try {
            const json: any = {};
            if (data.email != null) json.email = data.email;
            if (data.userName != null) json.userName = data.userName;
            if (data.otp != null) json.otp = data.otp;
            if (data.accessToken != null) json.accessToken = data.accessToken;
            if (data.refreshToken != null) json.refreshToken = data.refreshToken;
            if (data.verified != null) json.verified = data.verified;
            if (data.password != null) json.password = data.password;

            const profile = await this.db.collection(Constants.kUsersCollection)
                .doc(data.uid).update(json).then(async (e) => {
                    const doc = (await this.db.collection(Constants.kUsersCollection).doc(data.uid).get());
                    return doc.data()!;
                });

            return Helpers.documentDataToProfileData(profile);
        } catch (e) {
            Helpers.printAndAddToLog(`${e}`);
            throw new Error("Error occurred while creating user");
        }
    }
}