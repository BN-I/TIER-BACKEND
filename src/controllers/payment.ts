import { Request, Response } from "express";
import User from "../models/user";

class paymentController {
  static async Execute(req: Request, res: Response) {
    const { id, paidAmount } = req.body;

    if (!id || !paidAmount) {
      res.status(400).send({
        message: "Invalid request",
      });
      return;
    }

    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        res.status(400).send({
          message: "User not found",
        });
        return;
      }
      user.amountPaid = paidAmount;
      await user.save();
      res.status(200).send({
        message: "payment status updated successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating payment status",
      });
    }
  }
}

export { paymentController };
