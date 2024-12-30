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
Object.defineProperty(exports, "__esModule", { value: true });
const firestore_1 = require("firebase-admin/firestore");
const firebase_1 = require("../../../../config/firebase");
const constants_1 = require("../../../../utils/constants");
class DareDBServiceImpl {
    constructor() {
        this.db = (0, firestore_1.getFirestore)(firebase_1.app);
    }
    getAllDares() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const documents = yield this.db.collection(constants_1.Constants.kDaresCollection).get();
                return documents.docs.map((doc) => doc.data());
            }
            catch (e) {
                throw e;
            }
        });
    }
    filterDares(title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filters = [];
                if (title) {
                    filters.push(firestore_1.Filter.where('titleKeywords', 'array-contains-any', title.split(' ').map((word) => word.toLowerCase())));
                }
                if (description) {
                    filters.push(firestore_1.Filter.where('descriptionKeywords', 'array-contains-any', description.split(' ').map((word) => word.toLocaleLowerCase())));
                }
                const documents = yield this.db.collection(constants_1.Constants.kDaresCollection).where(firestore_1.Filter.or(...filters)).get();
                return documents.docs.map((doc) => doc.data());
            }
            catch (e) {
                throw e;
            }
        });
    }
    addNewDare(dare) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const daresCount = (yield this.db.collection(constants_1.Constants.kDaresCollection).count().get()).data().count;
                dare.index = daresCount;
                dare.createdAt = new Date().toISOString();
                dare.deleted = false;
                dare.updatedAt = null;
                dare.deletedAt = null;
                dare.titleKeywords = dare.title.split(' ').map((word) => word.toLowerCase());
                dare.descriptionKeywords = dare.description.split(' ').map((word) => word.toLowerCase());
                const docRef = yield this.db.collection(constants_1.Constants.kDaresCollection).add(dare);
                dare.id = docRef.id;
                return dare;
            }
            catch (e) {
                throw e;
            }
        });
    }
    removeDare(dareId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.db.collection(constants_1.Constants.kDaresCollection).doc(dareId).update({
                    "deleted": true,
                    "deletedAt": new Date().toISOString()
                }).then((_) => dareId);
            }
            catch (e) {
                throw e;
            }
        });
    }
    editDare(dare) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                dare.updatedAt = new Date().toISOString();
                return yield this.db.collection(constants_1.Constants.kDaresCollection).doc(dare.id).update(Object.assign({}, dare)).then((_) => dare);
            }
            catch (e) {
                throw e;
            }
        });
    }
    getRandomDare() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const daresCount = yield this.db.collection(constants_1.Constants.kDaresCollection).count().get();
                const randomField = Math.random() * daresCount.data().count;
                // Query for the first document where random_field >= random value
                const snapshot = yield this.db.collection(constants_1.Constants.kDaresCollection)
                    .where(firestore_1.Filter.and(firestore_1.Filter.where('index', '>=', randomField), firestore_1.Filter.where('deleted', '==', false)))
                    .orderBy('index')
                    .limit(1)
                    .get();
                // If no documents found, query for first document where random_field < random value
                if (snapshot.empty) {
                    const snapshot2 = yield this.db.collection(constants_1.Constants.kDaresCollection)
                        .where(firestore_1.Filter.and(firestore_1.Filter.where('index', '<=', randomField), firestore_1.Filter.where('deleted', '==', false)))
                        .orderBy('index')
                        .limit(1)
                        .get();
                    if (snapshot2.empty) {
                        throw new Error('No dare found');
                    }
                    const dare = snapshot2.docs[0].data();
                    dare.id = snapshot2.docs[0].id;
                    return dare;
                }
                if (snapshot.empty) {
                    throw new Error('No dare found');
                }
                const dare = snapshot.docs[0].data();
                dare.id = snapshot.docs[0].id;
                return dare;
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = DareDBServiceImpl;
