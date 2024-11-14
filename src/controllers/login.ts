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
      const user = await User.findOne({ email: email });

      if (!user) {
        res.status(400).send({
          message: "User not found",
        });
        return;
      }

      bcrypt.compare(password, user.password).then(function (result) {
        if (!result) {
          return res.status(400).send({
            message: "Invalid password",
          });
        }

        if (!process.env.JWT_SECRET) throw !process.env.JWT_SECRET;

        // Create a new JWT token for the user
        const userWithoutPassword = user.toJSON(); // Converts Sequelize model instance to plain object

        jwt.sign(
          { user: userWithoutPassword },
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              return res.status(500).send({
                message: "Failed to generate token",
              });
            }

            delete userWithoutPassword.password;
            userWithoutPassword.token = token;

            res.status(200).send({
              message: "Login successful",
              user: userWithoutPassword,
            });
          }
        );
      });
    } catch (e) {
      res.status(400).send({
        message: "Invalid request",
      });
    }
  }
}

module.exports = LoginController;
