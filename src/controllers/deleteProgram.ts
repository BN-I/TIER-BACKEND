import Program from "../models/program";
import { Request, Response } from "express";

class deleteProgramController {
  static async Execute(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(400).send({
          message: "Invalid request",
        });
      }

      Program.findByIdAndDelete(id).then(() => {
        res.status(200).send({
          message: "Program deleted successfully",
        });
      });
    } catch (error) {
      res.status(500).send({
        message: "Error deleting program",
      });
    }
  }
}

export { deleteProgramController };
