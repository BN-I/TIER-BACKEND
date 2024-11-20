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
exports.credentialsController = void 0;
const user_1 = __importDefault(require("../models/user"));
const mailer_1 = require("../utils/mailer");
class credentialsController {
    static Execute(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let UserRole;
            (function (UserRole) {
                UserRole["admin"] = "admin";
                UserRole["patient"] = "patient";
                UserRole["clinic"] = "clinic";
            })(UserRole || (UserRole = {}));
            const { id, dashboardUsername, dashboardPassword } = req.body;
            if (!id || !dashboardUsername || !dashboardPassword) {
                res.status(400).send({
                    message: "Invalid request",
                });
                return;
            }
            try {
                const user = yield user_1.default.findOne({ _id: id });
                if (!user) {
                    res.status(400).send({
                        message: "User not found",
                    });
                    return;
                }
                if (user.role == UserRole.admin) {
                    res.status(400).send({
                        message: "Cannot set credentials of admin user",
                    });
                    return;
                }
                if (user.amountPaid == 0) {
                    res.status(400).send({
                        message: "Cannot set credentials of unpaid user",
                    });
                    return;
                }
                user.dashboardUsername = dashboardUsername;
                user.dashboardPassword = dashboardPassword;
                yield user.save();
                yield mailer_1.transporter.sendMail({
                    from: process.env.SMTP_USER, // sender address
                    to: user.email, // list of receivers
                    subject: "Credentials Uploaded", // Subject line
                    text: "Your Credentials to dashbaoard have been uploaded on the T.I.E.R App ", // plain text body
                });
                return res.status(200).send({
                    message: "Credentials updated successfully",
                });
            }
            catch (error) {
                console.log(error);
                return res.status(500).send({
                    message: "Error updating credentials",
                });
            }
        });
    }
}
exports.credentialsController = credentialsController;
