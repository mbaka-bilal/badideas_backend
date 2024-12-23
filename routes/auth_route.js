"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_impl_1 = __importDefault(require("../controllers/controllers/auth_controller/auth_controller_impl"));
const user_records_db_service_impl_1 = require("../controllers/services/db_service/user_records_db_service_impl");
const auth_service_impl_1 = require("../controllers/services/auth_service/auth_service_impl");
const otp_controller_1 = require("../controllers/controllers/otp_controller/otp_controller");
const otp_service_impl_1 = require("../controllers/services/otp_service/otp_service_impl");
const authRoute = express_1.default.Router();
const authController = new auth_controller_impl_1.default(new auth_service_impl_1.AuthServiceImpl(new user_records_db_service_impl_1.UserRecordsDBServiceImpl()));
const otpController = new otp_controller_1.OtpController(new otp_service_impl_1.OtpServiceImpl(new user_records_db_service_impl_1.UserRecordsDBServiceImpl));
authRoute.post("/signup", authController.signup);
authRoute.post("/sendOtp", otpController.sendOtp);
authRoute.post("/verifyOtp", otpController.verifyOtp);
exports.default = authRoute;