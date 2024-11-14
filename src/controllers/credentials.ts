import { Request, Response } from "express";
import User from "../models/user";

class credentialsController {
  static async Execute(req: Request, res: Response) {
    enum UserRole {
      admin = "admin",
      patient = "patient",
      clinic = "clinic",
    }
    const { id, dashboardUsername, dashboardPassword } = req.body;
    if (!id || !dashboardUsername || !dashboardPassword) {
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

      if (user.role == UserRole.admin) {
        res.status(400).send({
          message: "Cannot set credentials of admin user",
        });
        return;
      }

      if (user.amountPaid == 0) {
        res.status(400).send({
          message: "Cannot set credentials of unpaid user",
        });
        return;
      }

      user.dashboardUsername = dashboardUsername;
      user.dashboardPassword = dashboardPassword;
      await user.save();
      res.status(200).send({
        message: "Credentials updated successfully",
      });
    } catch (error) {
      res.status(500).send({
        message: "Error updating credentials",
      });
    }
  }
}

export { credentialsController };
