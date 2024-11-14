import { patientsController } from "../controllers/patients";
import adminAuth from "../middlewares/adminAuth";
import { Request, Response } from "express";

const patientsRouter = require("express").Router();
patientsRouter.get(
  "/api/patients",
  adminAuth,
  async (req: Request, res: Response) => {
    patientsController.Execute(req, res);
  }
);

module.exports = patientsRouter;
