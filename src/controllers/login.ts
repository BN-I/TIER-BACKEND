// import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class LoginController {
  static async Execute(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }

    try {
      const user = await User.findOne({ email: email.trim().toLowerCase() });

      if (!user) {
        res.status(400).json({
          message: "User not found",
        });
        return;
      }

      bcrypt.compare(password, user.password).then(function (result) {
        if (!result) {
          return res.status(400).json({
            message: "Invalid password",
          });
        }

        if (!process.env.JWT_SECRET) throw !process.env.JWT_SECRET;

        // Create a new JWT token for the user
        const userWithoutPassword = user.toJSON(); // Converts Sequelize model instance to plain object
        delete userWithoutPassword.password;
        jwt.sign(
          { user: userWithoutPassword },
          process.env.JWT_SECRET,
          {},
          (err, token) => {
            if (err) {
              return res.status(500).send({
                message: "Failed to generate token",
              });
            }

            userWithoutPassword.token = token;

            res.status(200).json({
              message: "Login successful",
              user: userWithoutPassword,
            });
          }
        );
      });
    } catch (e) {
      res.status(400).json({
        message: "Invalid request",
      });
    }
  }
}

module.exports = LoginController;
