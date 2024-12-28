import express from 'express';

import AuthController from '../controllers/controllers/auth_controller/auth_controller';
import { UserRecordsDBServiceImpl } from '../controllers/services/db_service/user_records_db_service_impl';
import { AuthServiceImpl } from '../controllers/services/auth_service/auth_service_impl';
import { OtpController } from '../controllers/controllers/otp_controller/otp_controller';
import { OtpServiceImpl } from '../controllers/services/otp_service/otp_service_impl';
import { VerifyToken } from '../middleware/verify_token';

const authRoute = express.Router();
const authController = new AuthController(new AuthServiceImpl(new UserRecordsDBServiceImpl()));
const otpController = new OtpController(new OtpServiceImpl(new UserRecordsDBServiceImpl));
const verifyToken = new VerifyToken(new UserRecordsDBServiceImpl());

authRoute.post("/login", authController.login);
authRoute.post("/signup", authController.signup);
authRoute.post("/sendOtp", otpController.sendOtp);
authRoute.post("/verifyOtp", otpController.verifyOtp);
authRoute.post("/resetPassword", authController.resetPassword);
authRoute.post("/changePassword", verifyToken.verifyAccessToken, authController.changePassword);
authRoute.post("/refreshToken", authController.refreshToken);

export default authRoute;