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
const credentials_1 = require("../controllers/credentials");
const adminAuth_1 = __importDefault(require("../middlewares/adminAuth"));
const credentialsRouter = require("express").Router();
credentialsRouter.post("/api/credentials", adminAuth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    credentials_1.credentialsController.Execute(req, res);
}));
module.exports = credentialsRouter;
