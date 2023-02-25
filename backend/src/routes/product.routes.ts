import express from "express";
import { auth } from "../middleware/auth.middleware";
// import { auth } from "../middleware/auth.middleware";
import {
  addProduct,
  getProductById,
  getProducts,
  deleteProduct,
  updateProduct,
} from "../controllers/products.controller";

const router = express.Router();
router.use(auth);
router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
export const productsRouter = router;
