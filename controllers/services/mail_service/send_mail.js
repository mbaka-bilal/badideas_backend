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
exports.default = sendMail;
exports.sendMail = sendMail;
const nodemailer_1 = require("nodemailer");
const helpers_1 = __importDefault(require("../../../utils/helpers"));
function sendMail(receiverEmail, subject, html) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const transporter = (0, nodemailer_1.createTransport)({
                service: "gmail",
                auth: {
                    user: "hephcore@gmail.com",
                    pass: "kbtg atbv xigd sdyd"
                }
            });
            const info = yield transporter.sendMail({
                from: "BadIdeas <hephcore@gmail.com>",
                to: receiverEmail,
                subject: subject,
                html: html,
            });
        }
        catch (e) {
            helpers_1.default.printAndAddToLog(`${e}`);
            throw e;
        }
    });
}
