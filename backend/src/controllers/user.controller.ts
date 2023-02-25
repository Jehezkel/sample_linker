import { PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { getUserToken } from "../utils/jwt";
import Password from "../utils/password";

const prisma = new PrismaClient();

export async function login(req: Request, res: Response) {
  const { email, pass }: { email: string; pass: string } = req.body;

  if (!login || !pass)
    return res
      .status(400)
      .json({ message: "Request body needs to contain login and password." });

  let fetchedUser: User | null;
  try {
    fetchedUser = await prisma.user.findUnique({ where: { email: email } });
  } catch (error) {
    console.error(`Error on user fetching by mail: ${email}, error:${error}.`);
    return res.status(500).end();
  }

  if (!fetchedUser)
    return res.status(404).json({
      error: `User with mail ${email} - not found, please register first.`,
    });

  if (!(await Password.comparePasswords(pass, fetchedUser.passwordHash)))
    return res.status(403).json({ error: "Incorrect Password." });

  const token = getUserToken(fetchedUser);
  return res.status(200).json({ token: token });
}

//Just for development purpose
export async function getUserInfo(req: Request, res: Response) {
  res.status(200).json((req as AuthenticatedRequest).user);
}

export async function registerUser(req: Request, res: Response) {
  const { pass, email, name } = req.body;

  if (!email || !name || !pass) {
    return res.status(400).json({
      message: "Register request must contain user email, password and name.",
    });
  }

  if (await prisma.user.findUnique({ where: { email: email } })) {
    return res.status(409).json({
      error:
        "User with particular email already exists - please reset password.",
    });
  }

  const user = { email: email, name: name } as User;

  try {
    user.passwordHash = await Password.getPasswordHash(req.body.pass);
  } catch (error) {
    console.error(`Failed to get password hash: ${error}.`);
    return res.status(500).end();
  }

  try {
    console.log("saving user object:", user);
    await prisma.user.create({ data: user });
    return res.status(201).end();
  } catch (error) {
    console.error(`Error during saving user ${user} to database:${error}.`);
    return res.status(500).end();
  }
}
