import { Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcrypt";
import { UserObject } from "../types";

class SignupController {
  static async Execute(req: Request, res: Response) {
    const PASSWORD_REGEX =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;

    const saltRounds = 10;
    const { name, email, password, reference, program, role } = req.body;
    enum UserRole {
      admin = "admin",
      patient = "patient",
      clinic = "clinic",
    }

    if (!name || !email || !password || !reference || !program || !role) {
      return res.status(400).send({
        message: "Invalid request",
      });
    }
    console.log(role);
    // Check if role is a valid UserRole
    if (!Object.values(UserRole).includes(role)) {
      return res.status(400).send({
        message: "Invalid role provided.",
      });
    }

    // Validate the password against the regex
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).send({
        message:
          "Password must be 8-20 characters long, with at least one uppercase, one lowercase, one digit, and one special character.",
      });
    }

    const user = await User.findOne({ email: email });
    if (user) {
      return res.status(400).send({
        message: "User already exists",
      });
    }

    try {
      bcrypt.hash(password, saltRounds).then(async function (hash: string) {
        const newUser = await User.create({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password: hash,
          reference: reference.trim(),
          program: program,
          role: role,
        });

        const userWithoutPassword = newUser.toJSON(); // Converts Sequelize model instance to plain object
        delete userWithoutPassword.password;

        res.status(200).send({
          message: "User created successfully",
          user: userWithoutPassword,
        });
      });
    } catch (error) {
      res.status(500).send({
        message: "Error creating user",
      });
    }
  }
}

module.exports = SignupController;
