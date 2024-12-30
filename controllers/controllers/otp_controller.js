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
exports.OtpController = void 0;
const response_model_1 = __importDefault(require("../../models/models/response_model"));
const constants_1 = require("../../utils/constants");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const exception_handler_1 = require("../../utils/exceptions/exception_handler");
class OtpController {
    constructor(otpService) {
        this.otpService = otpService;
        this.sendOtp = this.sendOtp.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
    }
    sendOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                if (helpers_1.default.containsNullOrUndefined([
                    body.email,
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                yield this.otpService.sendOtp(body.email).then((e) => {
                    response.status(200).send((0, response_model_1.default)({ "status": true, "message": `Otp successfully sent to ${body.email}, make sure to also check spam folder` }));
                });
            }
            catch (e) {
                (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
    verifyOtp(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = request.body;
                if (helpers_1.default.containsNullOrUndefined([
                    body.email,
                    body.otp
                ])) {
                    response.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const user = yield this.otpService.verifyOtp(body.otp, body.email);
                response.status(200).send((0, response_model_1.default)({ "status": true, "message": "Otp verified successfully", data: user }));
            }
            catch (e) {
                (0, exception_handler_1.handleError)(e, response);
            }
        });
    }
}
exports.OtpController = OtpController;
