import jwt from "jsonwebtoken";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";

export interface TokenPayload {
  id: string;
  username: string;
  email: string;
}

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export default function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenKey = process.env.TOKEN_KEY;
  if (!tokenKey) throw new Error("TOKEN_KEY is missing in .env file");
  const tokenHeader = req.headers["x-access-token"];
  const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;
  if (!token) return res.status(403).send("Token is required");
  try {
    const decoded = jwt.verify(token, tokenKey) as TokenPayload;
    (req as AuthenticatedRequest).user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
}
export const auth = verifyToken;
