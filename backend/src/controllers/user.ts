import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest, TokenPayload } from "src/middleware/auth";
// import { config } from "dotenv";
export async function login(req: Request, res: Response) {
  console.log(req.body);
  const { login, pass }: { login: string; pass: string } = req.body;
  if (!login || !pass)
    return res
      .status(400)
      .json({ message: "Request body needs to contain login and password" });
  if (login !== "admin")
    return res.status(404).json({ message: "user not found" });
  if (pass !== "pass123")
    return res.status(401).json({ message: "incorrect password" });
  const userPayload = {
    username: "admin",
    id: "asjdklasjdlkasjdklasj",
    email: "admin@google.pl",
  } as TokenPayload;
  const tokenKey = process.env.TOKEN_KEY;
  if (!tokenKey) throw new Error("TOKEN_KEY is missing in .env");
  const token = jwt.sign({ userPayload }, tokenKey);
  return res.status(200).json({ message: "Welcome admin", token: token });
}
export async function getUserInfo(req: Request, res: Response) {
  res.status(200).json((req as AuthenticatedRequest).user);
}
