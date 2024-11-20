import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers["x-auth-token"]?.toString() ?? "";
    if (!token) {
      return res.status(401).send({ message: "Unauthorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    if (decoded && decoded.user.role === "admin") {
      next(); // User is authenticated and has admin role, proceed to the next middleware or route handler
    } else {
      return res.status(403).send({ message: "Forbidden" });
    }
  } catch (error) {
    return res.status(401).send({ message: "Unauthorized" });
  }
};

export default adminAuth;
