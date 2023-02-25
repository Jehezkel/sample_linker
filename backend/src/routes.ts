import express from "express";
import { userRouter } from "./routes/user.routes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/", (_req, res) => res.send("home it works"));

export default router;
