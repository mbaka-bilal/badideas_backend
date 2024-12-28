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
exports.AuthServiceImpl = void 0;
const auth_service_1 = __importDefault(require("./auth_service"));
const uuid_1 = require("uuid");
const profile_exceptions_1 = require("../../../utils/exceptions/profile_exceptions");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
const send_mail_1 = __importDefault(require("../mail_service/send_mail"));
const constants_1 = require("../../../utils/constants");
class AuthServiceImpl {
    constructor(dbService) {
        this.dbService = dbService;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({
                    email: email,
                });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound(constants_1.Constants.kUserNotFound);
                if ((yield helpers_1.default.comparePassword(password, user.password)) == false) {
                    throw new profile_exceptions_1.IncorrectPassword();
                }
                const accessToken = helpers_1.default.generateFreshTokens(user.uid, user.userName, user.email);
                return yield this.dbService.updateProfile({
                    uid: user.uid,
                    accessToken: accessToken[0],
                    refreshToken: accessToken[1],
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    signup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({
                    email: data.email,
                    userName: data.userName,
                });
                console.log(`user found ${JSON.stringify(user)}`);
                if (user != null) {
                    if (user.email == data.email) {
                        throw new profile_exceptions_1.UserExits("User with email exists");
                    }
                    if (user.userName == data.userName) {
                        throw new profile_exceptions_1.UserExits("username taken");
                    }
                    throw new profile_exceptions_1.UserExits("User with the same record exists");
                }
                const password = yield helpers_1.default.hashPassword(data.password);
                const otp = helpers_1.default.generateOtp();
                const userProfile = yield this.dbService.createUser({
                    email: data.email,
                    uid: `${(0, uuid_1.v4)()}_${data.email}`,
                    userName: data.userName,
                    createdAt: new Date().toISOString(),
                    password: password,
                    verified: false,
                    otp: otp,
                });
                (0, send_mail_1.default)([data.email], "Otp", otp);
                return userProfile;
            }
            catch (e) {
                throw e;
            }
        });
    }
    resetPassword(otp, password, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({
                    email: email,
                });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound();
                if (user.otp !== otp)
                    throw new Error("Incorrect otp");
                const accessToken = helpers_1.default.generateFreshTokens(user.uid, user.userName, user.email);
                return yield this.dbService.updateProfile({
                    uid: user.uid,
                    password: yield helpers_1.default.hashPassword(password),
                    accessToken: accessToken[0],
                    refreshToken: accessToken[1],
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({
                    refreshToken: refreshToken,
                });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound();
                const accessToken = helpers_1.default.generateFreshTokens(user.uid, user.userName, user.email);
                return yield this.dbService.updateProfile({
                    uid: user.uid,
                    accessToken: accessToken[0],
                    refreshToken: accessToken[1],
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
    changePassword(uid, oldPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({
                    id: uid,
                });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound();
                if ((yield helpers_1.default.comparePassword(oldPassword, user.password)) == false)
                    throw new profile_exceptions_1.IncorrectPassword();
                if ((yield helpers_1.default.comparePassword(newPassword, user.password)) == true)
                    throw new Error("New password cannot be same as old password");
                const accessToken = helpers_1.default.generateFreshTokens(user.uid, user.userName, user.email);
                return yield this.dbService.updateProfile({
                    uid: user.uid,
                    accessToken: accessToken[0],
                    refreshToken: accessToken[1],
                    password: yield helpers_1.default.hashPassword(newPassword),
                });
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.AuthServiceImpl = AuthServiceImpl;
exports.default = auth_service_1.default;
