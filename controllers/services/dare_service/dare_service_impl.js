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
class DareServiceImpl {
    constructor(dareDBService) {
        this.dareDBService = dareDBService;
        this.getRandomDare = this.getRandomDare.bind(this);
        this.addNewDare = this.addNewDare.bind(this);
        this.removeDare = this.removeDare.bind(this);
        this.editDare = this.editDare.bind(this);
        this.getAllDares = this.getAllDares.bind(this);
        this.filterDares = this.filterDares.bind(this);
    }
    getAllDares() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.getAllDares();
            }
            catch (e) {
                throw e;
            }
        });
    }
    filterDares(title, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.filterDares(title, description);
            }
            catch (e) {
                throw e;
            }
        });
    }
    addNewDare(dare) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.addNewDare(dare);
            }
            catch (e) {
                throw e;
            }
        });
    }
    removeDare(dareId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.removeDare(dareId);
            }
            catch (e) {
                throw e;
            }
        });
    }
    editDare(dare) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.editDare(dare);
            }
            catch (e) {
                throw e;
            }
        });
    }
    getRandomDare() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.dareDBService.getRandomDare();
            }
            catch (e) {
                throw e;
            }
        });
    }
}
exports.default = DareServiceImpl;
