"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dare_controller_1 = __importDefault(require("../controllers/controllers/dare_controller"));
const dare_service_impl_1 = __importDefault(require("../controllers/services/dare_service/dare_service_impl"));
const dare_db_service_impl_1 = __importDefault(require("../controllers/services/db_service/dare_db_service/dare_db_service_impl"));
const user_records_db_service_impl_1 = require("../controllers/services/db_service/user_records/user_records_db_service_impl");
const verify_token_1 = require("../middleware/verify_token");
const dareRoute = express_1.default.Router();
const dareController = new dare_controller_1.default(new dare_service_impl_1.default(new dare_db_service_impl_1.default()));
const verifyToken = new verify_token_1.VerifyToken(new user_records_db_service_impl_1.UserRecordsDBServiceImpl());
dareRoute.get("/randomDare", verifyToken.verifyAccessToken, dareController.getRandomDare);
dareRoute.post("/addNewDare", verifyToken.verifyAccessToken, dareController.addNewDare);
dareRoute.delete("/removeDare", verifyToken.verifyAccessToken, dareController.removeDare);
dareRoute.patch("/editDare", verifyToken.verifyAccessToken, dareController.editDare);
dareRoute.get("/filterDares", verifyToken.verifyAccessToken, dareController.filterDares);
dareRoute.get("/allDares", verifyToken.verifyAccessToken, dareController.getAllDares);
exports.default = dareRoute;
