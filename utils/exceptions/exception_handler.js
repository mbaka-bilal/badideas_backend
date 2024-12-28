"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const profile_exceptions_1 = require("./profile_exceptions");
const response_model_1 = __importDefault(require("../../models/models/response_model"));
const helpers_1 = __importDefault(require("../helpers"));
const constants_1 = require("../constants");
function handleError(e, response) {
    var _a;
    var message = "";
    var statusCode = 500;
    if (e instanceof profile_exceptions_1.UserNotFound) {
        statusCode = 404;
        message = e.message;
    }
    else if (e instanceof profile_exceptions_1.UserExits) {
        statusCode = 409;
        message = e.message;
    }
    else if (e.message == "Incorrect otp") {
        statusCode = 401;
        message = e.message;
    }
    else if (e instanceof profile_exceptions_1.IncorrectPassword) {
        statusCode = 401;
        message = e.message;
    }
    else {
        message = (_a = e.message) !== null && _a !== void 0 ? _a : constants_1.Constants.kServerError;
    }
    helpers_1.default.printAndAddToLog(`${e}`);
    response.status(statusCode).json((0, response_model_1.default)({ "status": false, "message": message }));
}
