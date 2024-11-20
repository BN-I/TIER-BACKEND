import program from "../models/program";
import { Request, Response } from "express";

class programController {
  static async Execute(req: Request, res: Response) {
    try {
      program.find().then((programs: any) => {
        res.status(200).send(programs);
      });
    } catch (error) {
      res.status(500).send({
        message: "Error fetching programs",
      });
    }
  }
}

export { programController };
