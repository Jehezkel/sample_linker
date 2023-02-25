import { User } from "@prisma/client";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "middleware/auth.middleware";
export interface TokenPayload {
  userId: number;
  userName: string;
  email: string;
}
export function getUserToken(user: User) {
  const tokenPayload = {
    userId: user.id,
    userName: user.name,
    email: user.email,
  } as TokenPayload;
  return jwt.sign(tokenPayload, getTokenKey(), { expiresIn: "1h" });
}
function getTokenKey() {
  const tokenKey = process.env.TOKEN_KEY;
  if (!tokenKey) throw new Error("TOKEN KEY UNDEFINED!");
  return tokenKey;
}
export function verifyToken(token: string) {
  return jwt.verify(token, getTokenKey()) as TokenPayload;
}
export function getUserIdFromReq(req: Request) {
  console.log("xxx", req as AuthenticatedRequest);
  return (req as AuthenticatedRequest).user.userId;
}
