import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { SignupInterface } from "../../models/interface/auth_interface";
import responseModel from '../../models/models/response_model';
import AuthService from '../services/auth_service/auth_service_impl';
import { Constants } from '../../utils/constants';
import Helpers from '../../utils/helpers';
import { handleError } from '../../utils/exceptions/exception_handler';

class AuthController {
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.signup = this.signup.bind(this);
        this.login = this.login.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.refreshToken = this.refreshToken.bind(this);
        this.resetPassword = this.resetPassword.bind(this);
    }

    async login(request: Request, response: Response): Promise<void> {
        try {
            if (Helpers.containsNullOrUndefined([
                request.body.password,
                request.body.email
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const resetPasswordResponse = await this.authService.login(request.body.email, request.body.password);

            response.status(200).send(responseModel({ "status": true, "message": "Password reset successful", "data": resetPasswordResponse }));
            return;
        } catch (e) {
            return handleError(e, response);
        }
    }


    async signup(request: Request, response: Response): Promise<void> {
        try {
            const signupData: SignupInterface = request.body;

            if (signupData.email == undefined || signupData.userName == undefined || signupData.password == undefined) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData, }));
                return;
            }

            const signupResponse = await this.authService.signup(signupData);

            response.status(200).send(responseModel({ "status": true, "message": "signup successful", "data": signupResponse }));
            return;
        } catch (e) {
            return handleError(e, response);

        }
    }


    async resetPassword(request: Request, response: Response): Promise<void> {
        try {
            if (Helpers.containsNullOrUndefined([
                request.body.password,
                request.body.otp,
                request.body.email
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }


            const resetPasswordResponse = await this.authService.resetPassword(request.body.otp, request.body.password, request.body.email);

            response.status(200).send(responseModel({ "status": true, "message": "Password reset successful", "data": resetPasswordResponse }));
            return;
        } catch (e) {
            return handleError(e, response);

        }
    }

    async changePassword(request: Request, response: Response): Promise<void> {
        try {
            if (Helpers.containsNullOrUndefined([
                request.body.oldPassword,
                request.body.newPassword,
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            console.log("user id", request.app.locals.decodedToken.uid);


            const changePasswordResponse = await this.authService.changePassword(request.app.locals.decodedToken.uid, request.body.oldPassword, request.body.newPassword);



            response.status(200).send(responseModel({ "status": true, "message": "Password changed successful", data: Helpers.cleanProfileData(changePasswordResponse) }));
            return;


        } catch (e) {
            handleError(e, response);
        }
    }

    async refreshToken(request: Request, response: Response): Promise<void> {
        try {
            if (Helpers.containsNullOrUndefined([
                request.body.refreshToken,
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const refreshTokenSecret: string = process.env.REFRESHTOKENSECRET!;

            const decodedToken = jwt.verify(request.body.refreshToken, refreshTokenSecret);

            console.log("decoded token", decodedToken);

            if (decodedToken) {
                const userProfile = Helpers.cleanProfileData(await this.authService.refreshToken(request.body.refreshToken));

                response.status(200).send(responseModel({ "status": true, "message": "Token refreshed successfully", data: userProfile }));

            } else {
                response.status(401).send(responseModel({ "status": false, "message": Constants.kUnauthorized }));
            }
        } catch (e) {
            if (e instanceof jwt.TokenExpiredError) {
                response.status(419).send({ "status": false, "message": Constants.kTokenExpired });
                return;
            }

            handleError(e, response);
        }
    }
}

export default AuthController;