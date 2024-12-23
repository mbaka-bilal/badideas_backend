"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = handleError;
const profile_exceptions_1 = require("./profile_exceptions");
const response_model_1 = __importDefault(require("../../models/models/response_model"));
const helpers_1 = __importDefault(require("../helpers"));
function handleError(e, response) {
    var message = "";
    var statusCode = 500;
    if (e instanceof profile_exceptions_1.UserNotFound) {
        statusCode = 404;
    }
    else if (e instanceof profile_exceptions_1.UserExits) {
        statusCode - 409;
    }
    else {
        //nothing
    }
    helpers_1.default.printAndAddToLog(e.message);
    response.status(statusCode).json((0, response_model_1.default)({ "status": false, "message": `${e.message}` }));
}
