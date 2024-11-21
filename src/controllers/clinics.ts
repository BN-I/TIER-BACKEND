import { Request, Response } from "express";
import User from "../models/user";
import { UserObject } from "../types";

class clinicsController {
  static async Execute(req: Request, res: Response) {
    try {
      User.find({ role: "Clinic" }).then((users: UserObject) => {
        res.status(200).send(users);
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching clinics",
      });
    }
  }
}

export { clinicsController };
