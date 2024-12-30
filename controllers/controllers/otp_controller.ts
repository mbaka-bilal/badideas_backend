import { Request, Response } from 'express';


import { OtpService } from "../services/otp_service/otp_service";
import responseModel from '../../models/models/response_model';
import { Constants } from '../../utils/constants';
import Helpers from '../../utils/helpers';
import { handleError } from '../../utils/exceptions/exception_handler';

export class OtpController {
    otpService: OtpService;

    constructor(otpService: OtpService) {
        this.otpService = otpService;
        this.sendOtp = this.sendOtp.bind(this);
        this.verifyOtp = this.verifyOtp.bind(this);
    }


    async sendOtp(request: Request, response: Response): Promise<void> {
        try {
            const body = request.body;

            if (Helpers.containsNullOrUndefined([
                body.email,
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            await this.otpService.sendOtp(body.email).then((e) => {
                response.status(200).send(responseModel({ "status": true, "message": `Otp successfully sent to ${body.email}, make sure to also check spam folder` }))
            });
        } catch (e) {
            handleError(e as Error, response);
        }
    }

    async verifyOtp(request: Request, response: Response): Promise<void> {
        try {
            const body = request.body;


            if (Helpers.containsNullOrUndefined([
                body.email,
                body.otp
            ])) {
                response.status(400).send(responseModel({ "status": false, "message": Constants.kMissingData }));
                return;
            }

            const user = await this.otpService.verifyOtp(body.otp, body.email);

            response.status(200).send(responseModel({ "status": true, "message": "Otp verified successfully", data: user }))

        } catch (e) {
            handleError(e as Error, response);
        }
    }

}