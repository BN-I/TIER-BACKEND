import { paymentController } from "../controllers/payment";
import auth from "../middlewares/auth";
import { Request, Response } from "express";

const paymentRouter = require("express").Router();
paymentRouter.post(
  "/api/payment",
  auth,
  async (req: Request, res: Response) => {
    paymentController.Execute(req, res);
  }
);

module.exports = paymentRouter;
