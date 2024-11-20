import { clinicsController } from "../controllers/clinics";
import adminAuth from "../middlewares/adminAuth";
import { Request, Response } from "express";

const clinicsRouter = require("express").Router();
clinicsRouter.get(
  "/api/clinics",
  adminAuth,
  async (req: Request, res: Response) => {
    clinicsController.Execute(req, res);
  }
);

module.exports = clinicsRouter;
