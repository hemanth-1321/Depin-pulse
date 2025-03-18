import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_PUBLIC_KEY } from "../../config";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    console.log("recieved token", authHeader);
    if (!authHeader) {
      res
        .status(401)
        .json({ error: "Unauthorized: Missing or invalid token format" });
      return;
    }

    const token = authHeader;
    const publicKey = JWT_PUBLIC_KEY;
    console.log(publicKey);

    if (!publicKey) {
      console.error("JWT_PUBLIC_KEY is not set in the environment variables");

      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const decoded = jwt.verify(token, publicKey) as jwt.JwtPayload;

    if (!decoded || !decoded.sub) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    req.userId = decoded.sub as string;
    next();
  } catch (err) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
};
