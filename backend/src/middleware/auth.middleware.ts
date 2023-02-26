import { NextFunction, Request, Response } from "express";
import { TokenPayload, verifyToken } from "../utils/jwt";

export interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

export default function isAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const tokenHeader = req.headers["x-access-token"];
  const token = Array.isArray(tokenHeader) ? tokenHeader[0] : tokenHeader;

  if (!token) return res.status(403).send("Token is required");
  try {
    const decodedTokenPayload = verifyToken(token);
    (req as AuthenticatedRequest).user = decodedTokenPayload;
    return next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Invalid token" });
  }
}
export const auth = isAuthorized;
