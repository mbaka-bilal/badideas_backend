"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserNotFound = exports.UserExits = void 0;
class UserExits extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.UserExits = UserExits;
class UserNotFound extends Error {
    constructor(message) {
        super(message);
        this.message = message;
    }
}
exports.UserNotFound = UserNotFound;
