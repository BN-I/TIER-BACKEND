import { credentialsController } from "../controllers/credentials";
import adminAuth from "../middlewares/adminAuth";
import { Request, Response } from "express";

const credentialsRouter = require("express").Router();
credentialsRouter.post(
  "/api/credentials",
  adminAuth,
  async (req: Request, res: Response) => {
    credentialsController.Execute(req, res);
  }
);

module.exports = credentialsRouter;
