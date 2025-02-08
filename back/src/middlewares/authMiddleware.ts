import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { getToken } from "../constants/congif";
import { IUser } from "../models/userModel";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authorization = req.header("Authorization");

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, getToken()) as IUser;
    req.params.userId = decoded._id;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
