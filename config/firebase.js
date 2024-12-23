"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const app_1 = require("firebase-admin/app");
exports.app = (0, app_1.initializeApp)({
    credential: (0, app_1.cert)("servicekey.json"),
});
