import { Request, Response } from "express";

class resetPasswordController {
  static async Execute(req: Request, res: Response) {
    const { email } = req.body;
    console.log(email);

    res.status(200).send({ message: "Password reset link sent successfully" });
  }
}

export { resetPasswordController };
