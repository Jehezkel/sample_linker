import express from "express";
import { auth } from "../middleware/auth.middleware";
import {
  getUserInfo,
  login,
  registerUser,
} from "../controllers/user.controller";
export const userRouter = express.Router();
userRouter.get("/", (_req, res) => res.status(200).send("Users works"));

userRouter.post("/signin", login);
userRouter.post("/register", registerUser);
userRouter.get("/check", auth, getUserInfo);
