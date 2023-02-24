import express from "express";
import { usersRouter } from "./user.routes";
const router = express.Router();
router.use("/users", usersRouter);
router.use("/", (_req, res) => res.send("home it works"));
export default router;
