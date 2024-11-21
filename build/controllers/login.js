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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class LoginController {
  static Execute(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).send({
          message: "Invalid request",
        });
        return;
      }
      try {
        const user = yield user_1.default.findOne({
          email: email.trim().toLowerCase(),
        });
        if (!user) {
          res.status(400).json({
            message: "User not found",
          });
          return;
        }
        bcrypt_1.default
          .compare(password, user.password)
          .then(function (result) {
            if (!result) {
              return res.status(400).json({
                message: "Invalid password",
              });
            }
            if (!process.env.JWT_SECRET) throw !process.env.JWT_SECRET;
            // Create a new JWT token for the user
            const userWithoutPassword = user.toJSON(); // Converts Sequelize model instance to plain object
            delete userWithoutPassword.password;
            jsonwebtoken_1.default.sign(
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
    });
  }
}
module.exports = LoginController;
