import { Response } from 'express';
import { UserExits, UserNotFound } from './profile_exceptions';
import responseModel from '../../models/models/response_model';
import Helpers from '../helpers';

export function handleError(e: Error, response: Response) {
    var message: string = "";
    var statusCode: number = 500;

    if (e instanceof UserNotFound) {
        statusCode = 404;
    } else if (e instanceof UserExits) {
        statusCode = 409;
    } else if (e.message == "Incorrect otp") {
        statusCode = 401;
    } else {
        //nothing
    }

    Helpers.printAndAddToLog(e.message);

    response.status(statusCode).json(responseModel({ "status": false, "message": `${e.message}` }));
}