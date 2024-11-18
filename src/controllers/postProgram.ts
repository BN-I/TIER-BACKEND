import { Request, Response } from "express";
import Program from "../models/program";

class postProgramController {
  static async Execute(req: Request, res: Response) {
    try {
      const { title, value, isActive } = req.body;

      if (!title || !value || isActive == undefined) {
        return res.status(400).send({
          message: "Invalid request",
        });
      }
      const program = new Program({ title, value, isActive });
      await program.save();
      return res.status(200).send(program);
    } catch (error) {
      return res.status(500).send({
        message: "Error creating program",
      });
    }
  }
}

export { postProgramController };
