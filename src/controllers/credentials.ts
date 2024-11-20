import { Request, Response } from "express";
import User from "../models/user";
import nodemailer from "nodemailer";
import { transporter } from "../utils/mailer";
class credentialsController {
  static async Execute(req: Request, res: Response) {
    enum UserRole {
      admin = "Admin",
      patient = "Patient",
      clinic = "Clinic",
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

      await transporter.sendMail({
        from: process.env.SMTP_USER, // sender address
        to: user.email, // list of receivers
        subject: "Credentials Uploaded", // Subject line
        text: "Your Credentials to dashbaoard have been uploaded on the T.I.E.R App ", // plain text body
      });

      return res.status(200).send({
        message: "Credentials updated successfully",
      });
    } catch (error) {
      console.log(error);
      return res.status(500).send({
        message: "Error updating credentials",
      });
    }
  }
}

export { credentialsController };
