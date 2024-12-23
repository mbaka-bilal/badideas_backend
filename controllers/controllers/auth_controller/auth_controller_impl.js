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
const response_model_1 = __importDefault(require("../../../models/models/response_model"));
const constants_1 = require("../../../utils/constants");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
const profile_exceptions_1 = require("../../../utils/exceptions/profile_exceptions");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = this.signup.bind(this);
    }
    signup(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const signupData = request.body;
                if (signupData.email == undefined || signupData.userName == undefined || signupData.password == undefined) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData, }));
                    return;
                }
                const signupResponse = yield this.authService.signup(signupData);
                response.status(200).send((0, response_model_1.default)({ "status": true, "message": "signup successful", "data": signupResponse }));
            }
            catch (e) {
                helpers_1.default.printAndAddToLog(`${e}`);
                if (e instanceof profile_exceptions_1.UserExits) {
                    response.status(403).send((0, response_model_1.default)({ "status": false, "message": e.message }));
                    return;
                }
                response.status(500).send((0, response_model_1.default)({
                    "status": false,
                    "message": "server error"
                }));
            }
        });
    }
    login(param) {
        throw new Error("Method not implemented.");
    }
    verifyOtp(param) {
        throw new Error("Method not implemented.");
    }
    sendOtp(param) {
        throw new Error("Method not implemented.");
    }
    changePassword(param) {
        throw new Error("Method not implemented.");
    }
    refreshToken(param) {
        throw new Error("Method not implemented.");
    }
}
exports.default = AuthController;
