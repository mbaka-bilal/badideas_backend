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
const bcrypt_1 = __importDefault(require("bcrypt"));
const uuid_1 = require("uuid");
const profile_exceptions_1 = require("../../../utils/exceptions/profile_exceptions");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
const send_mail_1 = __importDefault(require("../mail_service/send_mail"));
class AuthServiceImpl {
    constructor(dbService) {
        this.dbService = dbService;
        this.signup = this.signup.bind(this);
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
                const password = yield bcrypt_1.default.hash(data.password, 10);
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
}
exports.AuthServiceImpl = AuthServiceImpl;
exports.default = auth_service_1.default;
