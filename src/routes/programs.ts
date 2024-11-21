import { deleteProgramController } from "../controllers/deleteProgram";
import { postProgramController } from "../controllers/postProgram";
import { programController } from "../controllers/programs";
import auth from "../middlewares/auth";
import { Request, Response } from "express";

const programRouter = require("express").Router();
programRouter.get("/api/programs", async (req: Request, res: Response) => {
  programController.Execute(req, res);
});

programRouter.post(
  "/api/programs",
  auth,
  async (req: Request, res: Response) => {
    postProgramController.Execute(req, res);
  }
);

programRouter.delete(
  "/api/programs/:id",
  auth,
  async (req: Request, res: Response) => {
    deleteProgramController.Execute(req, res);
  }
);

module.exports = programRouter;
