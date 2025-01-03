"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importStar(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const response_model_1 = __importDefault(require("./models/models/response_model"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const helpers_1 = __importDefault(require("./utils/helpers"));
const dare_route_1 = __importDefault(require("./routes/dare_route"));
dotenv_1.default.config();
const PORT = process.env.PORT || 5212;
const baseUrl = "/api/v1";
const app = (0, express_1.default)();
app.use((0, express_1.urlencoded)({ "extended": true }));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
//TODO add a logger to logs all incoming requests.
//routes
app.use(baseUrl, auth_route_1.default);
app.use(baseUrl, dare_route_1.default);
app.all("/", (req, res) => {
    res.status(404).send({ "status": false, "message": "Unknown route" });
});
app.use((req, res) => {
    helpers_1.default.printAndAddToLog("Api Request handeled by no middleware", req.body);
    res.status(404).send((0, response_model_1.default)({
        "status": false,
        "message": "Uknown path"
    }));
});
app.listen(PORT, () => {
    console.log("listening on port", PORT);
});
