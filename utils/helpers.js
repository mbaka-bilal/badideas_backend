"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class Helpers {
    static printAndAddToLog(errorMessage, requestData) {
        const now = new Date();
        console.log(`${errorMessage} :::: ${now} :::: ${JSON.stringify(requestData)}`);
        //TODO add to error logs.
    }
    static documentDataToProfileData(data) {
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
        };
    }
    static containsNullOrUndefined(obj) {
        for (const key in obj) {
            if (obj[key] === null || obj[key] === undefined) {
                return true;
            }
        }
        return false;
    }
    static generateFreshTokens(userName, email) {
        const accessTokenSecret = process.env.ACCESSTOKENSECRET;
        const refreshTokenSecret = process.env.REFRESHTOKENSECRET;
        const accessToken = jsonwebtoken_1.default.sign({
            "username": userName,
            "email": email
        }, accessTokenSecret, {
            "expiresIn": "1m"
        });
        const refreshToken = jsonwebtoken_1.default.sign({
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
}
exports.default = Helpers;
