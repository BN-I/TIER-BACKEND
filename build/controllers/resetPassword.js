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
exports.resetPasswordController = void 0;
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mailer_1 = require("../utils/mailer");
var generator = require("generate-password");
class resetPasswordController {
    static Execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.body;
            if (!id) {
                res.status(400).send({ message: "Invalid request" });
                return;
            }
            try {
                const saltRounds = 10;
                var password = generator.generate({
                    length: 8,
                    numbers: true,
                    symbols: true,
                    lowercase: true,
                    uppercase: true,
                    strict: true,
                });
                yield user_1.default.findOne({ _id: id }).then((user) => __awaiter(this, void 0, void 0, function* () {
                    if (!user) {
                        res.status(400).send({ message: "User not found" });
                        return;
                    }
                    delete user.password;
                    bcrypt_1.default
                        .hash(password, saltRounds)
                        .then(function (hash) {
                        return __awaiter(this, void 0, void 0, function* () {
                            user.password = hash;
                            yield user.save();
                            res
                                .status(200)
                                .send({ message: "Password reset link sent successfully" });
                            yield mailer_1.transporter.sendMail({
                                from: process.env.SMTP_USER, // sender address
                                to: user.email, // list of receivers
                                subject: "Password Reset", // Subject line
                                text: `Your password to the app is ${password} `, // plain text body
                            });
                            return;
                        });
                    })
                        .catch((error) => {
                        return res
                            .status(500)
                            .send({ message: "Error resetting password" });
                    });
                }));
            }
            catch (error) {
                return res.status(500).send({ message: "Error resetting password" });
            }
        });
    }
}
exports.resetPasswordController = resetPasswordController;
