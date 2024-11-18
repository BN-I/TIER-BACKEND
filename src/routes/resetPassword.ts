import { resetPasswordController } from "../controllers/resetPassword";
import auth from "../middlewares/auth";
import { Request, Response } from "express";

const resetPasswordRouter = require("express").Router();
resetPasswordRouter.post(
  "/api/reset-password",
  async (req: Request, res: Response) => {
    resetPasswordController.Execute(req, res);
  }
);

module.exports = resetPasswordRouter;
