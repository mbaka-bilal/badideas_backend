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
exports.OtpServiceImpl = void 0;
const constants_1 = require("../../../utils/constants");
const profile_exceptions_1 = require("../../../utils/exceptions/profile_exceptions");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
const send_mail_1 = __importDefault(require("../mail_service/send_mail"));
class OtpServiceImpl {
    constructor(dbService) {
        this.dbService = dbService;
    }
    sendOtp(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = helpers_1.default.generateOtp();
                const user = yield this.dbService.fetchUser({ email: email });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound();
                yield this.dbService.updateProfile({ uid: user.uid, otp: otp });
                return yield (0, send_mail_1.default)([email], "OTP", otp).then(() => {
                    return true;
                });
            }
            catch (e) {
                //TODO handle exception.
                throw e;
            }
        });
    }
    verifyOtp(otp, email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.dbService.fetchUser({ email: email });
                if (user == null)
                    throw new profile_exceptions_1.UserNotFound();
                if (user.otp == null)
                    throw Error(constants_1.Constants.kServerError);
                if (user.otp == otp) {
                    const tokens = helpers_1.default.generateFreshTokens(user.uid, user.userName, user.email);
                    return yield this.dbService.updateProfile({
                        uid: user.uid,
                        verified: true,
                        accessToken: tokens[0],
                        refreshToken: tokens[1]
                    });
                }
                else {
                    throw Error("Incorrect otp");
                }
            }
            catch (e) {
                //TODO handle exception
                throw e;
            }
        });
    }
}
exports.OtpServiceImpl = OtpServiceImpl;
