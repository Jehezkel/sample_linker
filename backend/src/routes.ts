import express from "express";
import { productsRouter } from "./routes/product.routes";
import { userRouter } from "./routes/user.routes";
const router = express.Router();

router.use("/user", userRouter);
router.use("/products", productsRouter);
router.use("/", (_req, res) => res.send("home it works"));

export default router;
