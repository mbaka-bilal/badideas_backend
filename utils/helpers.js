"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
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
            password: data.password
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
    static generateFreshTokens(uid, userName, email) {
        const accessTokenSecret = process.env.ACCESSTOKENSECRET;
        const refreshTokenSecret = process.env.REFRESHTOKENSECRET;
        const accessToken = jsonwebtoken_1.default.sign({
            "uid": uid,
            "username": userName,
            "email": email
        }, accessTokenSecret, {
            "expiresIn": "30m"
        });
        const refreshToken = jsonwebtoken_1.default.sign({
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
    static hashPassword(paassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(paassword, 10);
        });
    }
    static comparePassword(password, password2) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, password2);
        });
    }
    static cleanProfileData(profile) {
        profile.password = null;
        profile.otp = null;
        return profile;
    }
}
exports.default = Helpers;
