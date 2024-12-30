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
const response_model_1 = __importDefault(require("../../models/models/response_model"));
const constants_1 = require("../../utils/constants");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const exception_handler_1 = require("../../utils/exceptions/exception_handler");
class AuthController {
    constructor(authService) {
        this.authService = authService;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }
    login(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (helpers_1.default.containsNullOrUndefined([
                    request.body.password,
                    request.body.email
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const resetPasswordResponse = yield this.authService.login(request.body.email, request.body.password);
                response.status(200).send((0, response_model_1.default)({ "status": true, "message": "Password reset successful", "data": resetPasswordResponse }));
                return;
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, response);
            }
        });
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
                return;
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
    resetPassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (helpers_1.default.containsNullOrUndefined([
                    request.body.password,
                    request.body.otp,
                    request.body.email
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const resetPasswordResponse = yield this.authService.resetPassword(request.body.otp, request.body.password, request.body.email);
                response.status(200).send((0, response_model_1.default)({ "status": true, "message": "Password reset successful", "data": resetPasswordResponse }));
                return;
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
    changePassword(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (helpers_1.default.containsNullOrUndefined([
                    request.body.oldPassword,
                    request.body.newPassword,
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                console.log("user id", request.app.locals.decodedToken.uid);
                const changePasswordResponse = yield this.authService.changePassword(request.app.locals.decodedToken.uid, request.body.oldPassword, request.body.newPassword);
                response.status(200).send((0, response_model_1.default)({ "status": true, "message": "Password changed successful", data: helpers_1.default.cleanProfileData(changePasswordResponse) }));
                return;
            }
            catch (e) {
                (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
    refreshToken(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (helpers_1.default.containsNullOrUndefined([
                    request.body.refreshToken,
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const refreshTokenSecret = process.env.REFRESHTOKENSECRET;
                const decodedToken = jsonwebtoken_1.default.verify(request.body.refreshToken, refreshTokenSecret);
                console.log("decoded token", decodedToken);
                if (decodedToken) {
                    const userProfile = helpers_1.default.cleanProfileData(yield this.authService.refreshToken(request.body.refreshToken));
                    response.status(200).send((0, response_model_1.default)({ "status": true, "message": "Token refreshed successfully", data: userProfile }));
                }
                else {
                    response.status(401).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kUnauthorized }));
                }
            }
            catch (e) {
                if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    response.status(419).send({ "status": false, "message": constants_1.Constants.kTokenExpired });
                    return;
                }
                (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
}
exports.default = AuthController;
