import express from "express";
import { auth } from "../middleware/auth.middleware";
import { getUserInfo, login } from "../controllers/user.controller";
export const userRouter = express.Router();
userRouter.get("/", (_req, res) => res.status(200).send("Users works"));

userRouter.post("/signin", login);
userRouter.get("/check", auth, getUserInfo);
