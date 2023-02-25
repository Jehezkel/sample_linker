import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getUserToken, TokenPayload } from "../utils/jwt";
import Password from "../utils/password";

const prisma = new PrismaClient();
export async function login(req: Request, res: Response) {
  console.log(req.body);
  const { email, pass }: { email: string; pass: string } = req.body;
  if (!login || !pass)
    return res
      .status(400)
      .json({ message: "Request body needs to contain login and password" });
  const user = await prisma.user.findUnique({ where: { email: email } });
  if (!user) return res.status(404).json({ error: "USER NOT FOUND" });
  if (!(await Password.comparePasswords(pass, user.passwordHash)))
    return res.status(403).json({ error: "INCORRECT PASSWORD" });
  const tokenPayload = {
    email: user.email,
    userId: user.id,
    userName: user.name,
  } as TokenPayload;
  const token = getUserToken(tokenPayload);
  return res.status(200).json({ token: token });
}

export async function getUserInfo(req: Request, res: Response) {
  res.status(200).json((req as AuthenticatedRequest).user);
}
