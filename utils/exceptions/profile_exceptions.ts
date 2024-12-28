import { Constants } from "../constants";

export class UserExits extends Error {
    message: string

    constructor(message?: string | null) {
        super(message ?? Constants.kUserExists);
        this.message = message ?? Constants.kUserExists;
    }

}

export class UserNotFound extends Error {
    message: string

    constructor(message?: string | null) {
        super(message ?? Constants.kUserNotFound);
        this.message = message ?? Constants.kUserNotFound;
    }
}

export class IncorrectPassword extends Error {
    message: string

    constructor(message?: string | null) {
        super(message ?? Constants.kIncorrectPassword);
        this.message = message ?? Constants.kIncorrectPassword;
    }
}