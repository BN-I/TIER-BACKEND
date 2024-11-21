"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = __importDefault(require("../models/user"));
const bcrypt_1 = __importDefault(require("bcrypt"));
class SignupController {
  static Execute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const PASSWORD_REGEX =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,20}$/;
      const saltRounds = 10;
      const { name, email, password, reference, program, role } = req.body;
      let UserRole;
      (function (UserRole) {
        UserRole["admin"] = "admin";
        UserRole["patient"] = "patient";
        UserRole["clinic"] = "clinic";
      })(UserRole || (UserRole = {}));
      if (!name || !email || !password || !reference || !program || !role) {
        return res.status(400).send({
          message: "Invalid request",
        });
      }
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
      const user = yield user_1.default.findOne({ email: email });
      if (user) {
        return res.status(400).send({
          message: "User already exists",
        });
      }
      try {
        bcrypt_1.default.hash(password, saltRounds).then(function (hash) {
          return __awaiter(this, void 0, void 0, function* () {
            const newUser = yield user_1.default.create({
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
        });
      } catch (error) {
        res.status(500).send({
          message: "Error creating user",
        });
      }
    });
  }
}
module.exports = SignupController;
