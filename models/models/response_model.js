"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function responseModel(response) {
    return Object.assign({ "status": response.status, "message": response.message }, (response.data != null ? { "data": response.data } : {}));
}
exports.default = responseModel;
