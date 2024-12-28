import { Response } from 'express';
import { IncorrectPassword, UserExits, UserNotFound } from './profile_exceptions';
import responseModel from '../../models/models/response_model';
import Helpers from '../helpers';
import { Constants } from '../constants';

export function handleError(e: any, response: Response) {
    var message: string = "";
    var statusCode: number = 500;

    if (e instanceof UserNotFound) {
        statusCode = 404;
        message = e.message;
    } else if (e instanceof UserExits) {
        statusCode = 409;
        message = e.message;
    } else if (e.message == "Incorrect otp") {
        statusCode = 401;
        message = e.message;
    } else if (e instanceof IncorrectPassword) {
        statusCode = 401;
        message = e.message;
    } else {
        message = e.message ?? Constants.kServerError
    }

    Helpers.printAndAddToLog(`${e}`);

    response.status(statusCode).json(responseModel({ "status": false, "message": message }));
}