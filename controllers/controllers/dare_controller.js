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
const response_model_1 = __importDefault(require("../../models/models/response_model"));
const exception_handler_1 = require("../../utils/exceptions/exception_handler");
const helpers_1 = __importDefault(require("../../utils/helpers"));
const constants_1 = require("../../utils/constants");
class DareController {
    constructor(dareService) {
        this.dareService = dareService;
        this.dareService = dareService;
        this.getRandomDare = this.getRandomDare.bind(this);
        this.addNewDare = this.addNewDare.bind(this);
        this.removeDare = this.removeDare.bind(this);
        this.editDare = this.editDare.bind(this);
        this.filterDares = this.filterDares.bind(this);
        this.getAllDares = this.getAllDares.bind(this);
    }
    getRandomDare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomDare = yield this.dareService.getRandomDare();
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare fetched successfully", "data": helpers_1.default.cleanDareData(randomDare) }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
    getAllDares(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const randomDare = yield this.dareService.getAllDares();
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare fetched successfully", "data": randomDare.map(dare => helpers_1.default.cleanDareData(dare)) }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
    filterDares(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.query.title && !req.query.description) {
                    res.status(400).send((0, response_model_1.default)({ "status": false, "message": "Invalid filter request" }));
                    return;
                }
                const result = yield this.dareService.filterDares(req.query.title, req.query.description);
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare fetched successfully", "data": result.map(dare => helpers_1.default.cleanDareData(dare)) }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
    addNewDare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dare = req.body;
                if (helpers_1.default.containsNullOrUndefined([
                    dare.title,
                    dare.description,
                    dare.difficulty
                ])) {
                    res.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const newDare = yield this.dareService.addNewDare(dare);
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare added successfully", "data": helpers_1.default.cleanDareData(newDare) }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
    removeDare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (helpers_1.default.containsNullOrUndefined([
                    req.body.id
                ])) {
                    res.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const dareId = yield this.dareService.removeDare(req.body.id);
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare removed successfully", "data": { "id": dareId } }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
    editDare(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const dare = req.body;
                if (helpers_1.default.containsNullOrUndefined([
                    dare.id,
                ])) {
                    res.status(400).send((0, response_model_1.default)({ "status": false, "message": constants_1.Constants.kMissingData }));
                    return;
                }
                const editedDare = yield this.dareService.editDare(dare);
                res.status(200).send((0, response_model_1.default)({ "status": true, "message": "Dare edited successfully", "data": helpers_1.default.cleanDareData(editedDare) }));
            }
            catch (e) {
                return (0, exception_handler_1.handleError)(e, res);
            }
        });
    }
}
exports.default = DareController;
