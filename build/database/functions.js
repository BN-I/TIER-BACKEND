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
exports.databaseConnect = databaseConnect;
exports.databaseDisconnect = databaseDisconnect;
require("dotenv/config");
const mongoose_1 = __importDefault(require("mongoose"));
const MONGODB_CONNECTION = process.env.MONGODB_CONNECTION;
function databaseConnect() {
    return __awaiter(this, void 0, void 0, function* () {
        if (MONGODB_CONNECTION) {
            yield mongoose_1.default.connect(MONGODB_CONNECTION);
        }
    });
}
function databaseDisconnect() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.disconnect();
    });
}
