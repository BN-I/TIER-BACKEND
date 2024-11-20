"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.databaseListeners = databaseListeners;
const mongoose_1 = __importDefault(require("mongoose"));
function databaseListeners() {
    mongoose_1.default.connection.once("open", () => {
        console.log("Database connected!");
    });
    mongoose_1.default.connection.on("error", (err) => {
        console.error(err);
    });
}
