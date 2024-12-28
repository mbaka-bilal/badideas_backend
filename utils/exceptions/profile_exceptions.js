"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IncorrectPassword = exports.UserNotFound = exports.UserExits = void 0;
const constants_1 = require("../constants");
class UserExits extends Error {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : constants_1.Constants.kUserExists);
        this.message = message !== null && message !== void 0 ? message : constants_1.Constants.kUserExists;
    }
}
exports.UserExits = UserExits;
class UserNotFound extends Error {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : constants_1.Constants.kUserNotFound);
        this.message = message !== null && message !== void 0 ? message : constants_1.Constants.kUserNotFound;
    }
}
exports.UserNotFound = UserNotFound;
class IncorrectPassword extends Error {
    constructor(message) {
        super(message !== null && message !== void 0 ? message : constants_1.Constants.kIncorrectPassword);
        this.message = message !== null && message !== void 0 ? message : constants_1.Constants.kIncorrectPassword;
    }
}
exports.IncorrectPassword = IncorrectPassword;
