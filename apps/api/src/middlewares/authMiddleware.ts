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
    console.log("Received token:", authHeader);

    if (!authHeader) {
      res
        .status(401)
        .json({ error: "Unauthorized: Missing or invalid token format" });
      return;
    }

    const token = authHeader;
    const publicKey = JWT_PUBLIC_KEY;

    if (!publicKey) {
      console.error("JWT_PUBLIC_KEY is not set in the environment variables");
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const decoded = jwt.verify(token, publicKey, {
      algorithms: ["RS256"],
    }) as jwt.JwtPayload;

    if (!decoded || !decoded.sub) {
      res.status(401).json({ error: "Unauthorized: Invalid token" });
      return;
    }

    // Log the token's expiration time
    if (decoded.exp) {
      const expiryDate = new Date(decoded.exp * 1000); // Convert UNIX timestamp to date
      console.log(`Token expires at: ${expiryDate.toISOString()}`);
    } else {
      console.log("Token does not have an expiration field.");
    }

    req.userId = decoded.sub as string;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
    return;
  }
};
