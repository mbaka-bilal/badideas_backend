import { Request, Response } from 'express';


import { SignupInterface } from "../../../models/interface/auth_interface";
import responseModel from '../../../models/models/response_model';
import AuthService from '../../services/auth_service/auth_service_impl';
import { Constants } from '../../../utils/constants';
import Helpers from '../../../utils/helpers';
import { UserExits } from '../../../utils/exceptions/profile_exceptions';

class AuthController {
    authService: AuthService;

    constructor(authService: AuthService) {
        this.authService = authService;
        this.signup = this.signup.bind(this);
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
        } catch (e) {
            Helpers.printAndAddToLog(`${e}`);

            if (e instanceof UserExits) {
                response.status(403).send(responseModel({ "status": false, "message": e.message }));
                return;
            }

            response.status(500).send(responseModel({
                "status": false,
                "message": "server error"
            }));
        }
    }
    login(param: SignupInterface): Promise<void> {
        throw new Error("Method not implemented.");
    }
    verifyOtp(param: SignupInterface): Promise<void> {
        throw new Error("Method not implemented.");
    }
    sendOtp(param: SignupInterface): Promise<void> {
        throw new Error("Method not implemented.");
    }
    changePassword(param: SignupInterface): Promise<void> {
        throw new Error("Method not implemented.");
    }
    refreshToken(param: SignupInterface): Promise<void> {
        throw new Error("Method not implemented.");
    }
}

export default AuthController;