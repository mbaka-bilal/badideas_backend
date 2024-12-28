import jwt from 'jsonwebtoken';

import bcrypt from 'bcrypt';

import { DocumentData } from "firebase-admin/firestore";
import { UserProfileInterface } from "../models/interface/user_profile_interface";

class Helpers {
    static printAndAddToLog(errorMessage: string, requestData?: object | null): void {
        const now: Date = new Date();

        console.log(`${errorMessage} :::: ${now} :::: ${JSON.stringify(requestData)}`);

        //TODO add to error logs.
    }

    static documentDataToProfileData(data: DocumentData): UserProfileInterface {
        return {
            uid: data.uid,
            email: data.email,
            userName: data.userName,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
            deletedAt: data.deletedAt,
            verified: data.verified,
            otp: data.otp,
            password: data.password
        }
    }

    static containsNullOrUndefined(obj: { [key: string]: any }): boolean {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                return true;
            }
        }
        return false;
    }

    static generateFreshTokens(uid: string, userName: string, email: string): string[] {
        const accessTokenSecret: string = process.env.ACCESSTOKENSECRET!;
        const refreshTokenSecret: string = process.env.REFRESHTOKENSECRET!;


        const accessToken = jwt.sign({
            "uid": uid,
            "username": userName,
            "email": email
        }, accessTokenSecret, {
            "expiresIn": "30m"
        });
        const refreshToken = jwt.sign({
            "uid": uid,
            "username": userName,
            "email": email
        }, refreshTokenSecret, {
            "expiresIn": "2 days"
        });

        return [accessToken, refreshToken];

    }

    static generateOtp() {
        const characters = "123456789";
        let code = "";

        for (let i = 0; i < 5; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            code += characters[randomIndex];
        }

        return code;

    }

    static async hashPassword(paassword: string): Promise<string> {
        return await bcrypt.hash(paassword, 10);
    }

    static async comparePassword(password: string, password2: string): Promise<boolean> {
        return await bcrypt.compare(password, password2);
    }

    static cleanProfileData(profile: UserProfileInterface) {
        profile.password = null;
        profile.otp = null;

        return profile;
    }

}



export default Helpers;