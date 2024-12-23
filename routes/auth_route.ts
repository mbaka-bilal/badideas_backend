import express from 'express';

import AuthController from '../controllers/controllers/auth_controller/auth_controller_impl';
import { UserRecordsDBServiceImpl } from '../controllers/services/db_service/user_records_db_service_impl';
import { AuthServiceImpl } from '../controllers/services/auth_service/auth_service_impl';
import { OtpController } from '../controllers/controllers/otp_controller/otp_controller';
import { OtpServiceImpl } from '../controllers/services/otp_service/otp_service_impl';

const authRoute = express.Router();
const authController = new AuthController(new AuthServiceImpl(new UserRecordsDBServiceImpl()));
const otpController = new OtpController(new OtpServiceImpl(new UserRecordsDBServiceImpl));

authRoute.post("/signup", authController.signup);
authRoute.post("/sendOtp", otpController.sendOtp);
authRoute.post("/verifyOtp", otpController.verifyOtp);

export default authRoute;