"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const http_1 = require("http");
const functions_1 = require("./database/functions");
const listeners_1 = require("./database/listeners");
const PORT = process.env.API_PORT || 8080;
const server = (0, http_1.createServer)(app_1.default);
server.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});
function startServer() {
    (0, functions_1.databaseConnect)();
    (0, listeners_1.databaseListeners)();
    /* Log every missing environment variable that's required */
    const envRequired = ["API_PORT", "JWT_SECRET"];
    envRequired.forEach((prop) => {
        if (!process.env[prop]) {
            console.log(`Required environment variable '${prop}' wasn't provided.`);
        }
    });
}
startServer();
