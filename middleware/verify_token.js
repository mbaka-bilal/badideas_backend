"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const constants_1 = require("../utils/constants");
class VerifyToken {
    constructor(userRecordsDBService) {
        this.userRecordsDBService = userRecordsDBService;
        this.verifyAccessToken = this.verifyAccessToken.bind(this);
    }
    verifyAccessToken(request, response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // console.log("request.headers", request.headers.authorization);
                const accessToken = request.headers.authorization.split(" ")[1];
                if (!accessToken) {
                    response.status(401).send({ "status": false, "message": constants_1.Constants.kUnauthorized });
                    return;
                }
                const accessTokenSecret = process.env.ACCESSTOKENSECRET;
                const decodedToken = jsonwebtoken_1.default.verify(accessToken, accessTokenSecret);
                const user = yield this.userRecordsDBService.fetchUser({ id: decodedToken.uid });
                if (user == null || user.accessToken != accessToken)
                    throw new Error(constants_1.Constants.kUnauthorized);
                // Attach the decoded token to the request object
                request.app.locals.decodedToken = decodedToken;
                next();
            }
            catch (e) {
                if (e instanceof jsonwebtoken_1.default.TokenExpiredError) {
                    response.status(419).send({ "status": false, "message": constants_1.Constants.kTokenExpired });
                    return;
                }
                response.status(401).send({ "status": false, "message": constants_1.Constants.kUnauthorized });
                return;
            }
        });
    }
    ;
}
exports.VerifyToken = VerifyToken;
