import type { NextFunction, Request, Response } from "express";

export const authMiddleWare = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];

  req.userId = "1";
  next();
};
