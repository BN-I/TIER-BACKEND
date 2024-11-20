import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { UserObject } from "../types";
import bcrypt from "bcrypt";
import { transporter } from "../utils/mailer";
var generator = require("generate-password");

class resetPasswordController {
  static async Execute(req: Request, res: Response) {
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

      await User.findOne({ _id: id }).then(async (user: typeof User) => {
        if (!user) {
          res.status(400).send({ message: "User not found" });
          return;
        }
        delete user.password;

        bcrypt
          .hash(password, saltRounds)
          .then(async function (hash: string) {
            user.password = hash;
            await user.save();

            res
              .status(200)
              .send({ message: "Password reset link sent successfully" });

            await transporter.sendMail({
              from: process.env.SMTP_USER, // sender address
              to: user.email, // list of receivers
              subject: "Password Reset", // Subject line
              text: `Your password to the app is ${password} `, // plain text body
            });
            return;
          })
          .catch((error) => {
            return res
              .status(500)
              .send({ message: "Error resetting password" });
          });
      });
    } catch (error) {
      return res.status(500).send({ message: "Error resetting password" });
    }
  }
}

export { resetPasswordController };
