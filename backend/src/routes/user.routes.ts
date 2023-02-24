import express from "express";
import { auth } from "../middleware/auth";
import { getUserInfo, login } from "../controllers/user";
export const usersRouter = express.Router();
usersRouter.get("/", (_req, res) => res.status(200).send("Users works"));

usersRouter.post("/signin", login);
usersRouter.get("/check", auth, getUserInfo);
