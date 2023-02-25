import { PrismaClient, Product } from "@prisma/client";
import { Request, Response } from "express";
import { getUserIdFromReq } from "../utils/jwt";

const prisma = new PrismaClient();

export async function getProducts(req: Request, res: Response) {
  let products: Product[];
  try {
    products = await prisma.product.findMany({
      where: { userId: getUserIdFromReq(req) },
    });
    return res.status(200).json(products);
  } catch (error) {
    console.error("Error on fetch products:", error);
    return res.status(500).end();
  }
}
export async function addProduct(req: Request, res: Response) {
  const { ean, sku, name } = req.body;
  if (!ean || !sku || !name)
    return res
      .status(400)
      .json({ error: "Request needs body with ean sku and name" });
  const userId = getUserIdFromReq(req);
  console.log("UserID", userId);
  try {
    const fetchedProduct = await prisma.product.findFirst({
      where: {
        userId: userId,
        AND: { OR: [{ sku: sku }, { ean: ean }] },
      },
    });
    if (fetchedProduct)
      return res.status(409).json({
        error: "Conflicting product already exists",
        product: fetchedProduct,
      });
  } catch (error) {
    console.error("Error while fetching product before create: ", error);
    return res.status(500).end();
  }

  const product = { ean: ean, sku: sku, name: name, userId: userId } as Product;
  try {
    const responseProduct = await prisma.product.create({
      data: product,
      select: {
        id: true,
        ean: true,
        user: { select: { name: true } },
        name: true,
        sku: true,
      },
    });
    return res.status(201).json({ responseProduct });
  } catch (error) {
    console.error("Error on saving the product: ", error);
    return res.status(500).end();
  }
}

export async function deleteProduct(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Product id to delete is required." });

  const productId = parseInt(req.params.id);
  try {
    const fetchedProduct = await prisma.product.findFirst({
      where: {
        userId: userId,
        id: productId,
      },
    });
    if (!fetchedProduct)
      return res.status(404).json({
        error: `Product with id ${productId} not found.`,
      });
  } catch (error) {
    console.error("Error while fetching product before create: ", error);
    return res.status(500).end();
  }

  try {
    await prisma.product.delete({ where: { id: productId } });
    return res.status(204).end();
  } catch (error) {
    console.error(`Error on deleting productId(${productId}): ${error}`);
    return res.status(500).end();
  }
  //   res.send("deleteProduct not implemented yet.");
}
export async function getProductById(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Product id is required." });

  const productId = parseInt(req.params.id);
  try {
    const fetchedProduct = await prisma.product.findFirst({
      where: {
        userId: userId,
        id: productId,
      },
    });
    if (!fetchedProduct)
      return res.status(404).json({
        error: `Product with id ${productId} not found.`,
      });
    return res.status(200).json(fetchedProduct);
  } catch (error) {
    console.error("Error while fetching product before create: ", error);
    return res.status(500).end();
  }
}
export async function updateProduct(req: Request, res: Response) {
  const userId = getUserIdFromReq(req);
  if (!req.params.id)
    return res.status(400).json({ error: "Product id is required." });

  const { ean, sku, name } = req.body;
  if (!ean || !sku || !name)
    return res
      .status(400)
      .json({ error: "Request needs body with ean sku and name" });

  const productId = parseInt(req.params.id);
  try {
    const fetchedProduct = await prisma.product.findFirst({
      where: {
        userId: userId,
        id: productId,
      },
    });
    if (!fetchedProduct)
      return res.status(404).json({
        error: `Product with id ${productId} not found.`,
      });
  } catch (error) {
    console.error("Error while fetching product before create: ", error);
    return res.status(500).end();
  }
  try {
    const updatedResult = await prisma.product.update({
      where: { id: productId },
      data: { name: name, sku: sku, ean: ean },
    });
    return res.status(204).json({ updatedResult });
  } catch (error) {
    console.error("Error while updating product: ", error);
    return res.status(500).end();
  }
}

// function getProductId(req:Request){

// }
