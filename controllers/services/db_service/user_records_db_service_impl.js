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
exports.UserRecordsDBServiceImpl = void 0;
const firestore_1 = require("firebase-admin/firestore");
const firebase_1 = require("../../../config/firebase");
const constants_1 = require("../../../utils/constants");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
class UserRecordsDBServiceImpl {
    constructor() {
        this.db = (0, firestore_1.getFirestore)(firebase_1.app);
    }
    fetchUser(param) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = this.createFilters(param);
                const querysnapshot = yield this.db.collection(constants_1.Constants.kUsersCollection)
                    .where(firestore_1.Filter.or(...filters)).get();
                const documents = querysnapshot.docs;
                if (documents.length === 0) {
                    return null;
                }
                if (documents.length > 1) {
                    throw new Error(constants_1.Constants.kServerError);
                }
                const data = documents[0].data();
                return helpers_1.default.documentDataToProfileData(data);
            }
            catch (e) {
                helpers_1.default.printAndAddToLog(`${e}`);
                throw new Error("Error occurred while fetching user");
            }
        });
    }
    createFilters(param) {
        const filters = [];
        if (param.email) {
            filters.push(firestore_1.Filter.where("email", "==", param.email));
        }
        if (param.userName) {
            filters.push(firestore_1.Filter.where("userName", "==", param.userName));
        }
        if (param.accessToken) {
            filters.push(firestore_1.Filter.where("accessToken", "==", param.accessToken));
        }
        if (param.refreshToken) {
            filters.push(firestore_1.Filter.where("refreshToken", "==", param.refreshToken));
        }
        if (param.id) {
            filters.push(firestore_1.Filter.where("uid", "==", param.id));
        }
        return filters;
    }
    createUser(userDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.db.collection(constants_1.Constants.kUsersCollection).doc(userDetails.uid).set(userDetails);
                return userDetails;
            }
            catch (e) {
                helpers_1.default.printAndAddToLog(`${e}`);
                throw new Error("Error occurred while creating user");
            }
        });
    }
    updateProfile(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const json = {};
                if (data.email != null)
                    json.email = data.email;
                if (data.userName != null)
                    json.userName = data.userName;
                if (data.otp != null)
                    json.otp = data.otp;
                if (data.accessToken != null)
                    json.accessToken = data.accessToken;
                if (data.refreshToken != null)
                    json.refreshToken = data.refreshToken;
                if (data.verified != null)
                    json.verified = data.verified;
                if (data.password != null)
                    json.password = data.password;
                const profile = yield this.db.collection(constants_1.Constants.kUsersCollection)
                    .doc(data.uid).update(json).then((e) => __awaiter(this, void 0, void 0, function* () {
                    const doc = (yield this.db.collection(constants_1.Constants.kUsersCollection).doc(data.uid).get());
                    return doc.data();
                }));
                return helpers_1.default.documentDataToProfileData(profile);
            }
            catch (e) {
                helpers_1.default.printAndAddToLog(`${e}`);
                throw new Error("Error occurred while creating user");
            }
        });
    }
}
exports.UserRecordsDBServiceImpl = UserRecordsDBServiceImpl;
