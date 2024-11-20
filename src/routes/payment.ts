import { paymentController } from "../controllers/payment";
import auth from "../middlewares/auth";
import { Request, Response } from "express";

const paymentRouter = require("express").Router();
paymentRouter.post(
  "/api/payment/create-subscription",
  auth,
  async (req: Request, res: Response) => {
    paymentController.createSubscription(req, res);
  }
);

module.exports = paymentRouter;
