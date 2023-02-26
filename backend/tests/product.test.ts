import { PrismaClient, Product } from "@prisma/client";
import supertest from "supertest";
import { app } from "../src/app";
import testUtils from "./test.utils";

describe("Crud operations on products", () => {
  let prisma: PrismaClient;
  let testUserId: number;
  beforeAll(async () => {
    prisma = new PrismaClient();
    const user = testUtils.user;
    const { id: userId } = await prisma.user.upsert({
      create: user,
      where: { email: testUtils.user.email },
      update: {},
      select: { id: true },
    });
    if (userId) testUserId = userId;

    await prisma.product.deleteMany();
    await prisma.product.createMany({
      data: [
        {
          ean: "12312312",
          sku: "aalksdjklasjdk",
          name: "kij od szczotki",
          userId: userId,
        },
        {
          ean: "555123",
          sku: "287132akjd",
          name: "pasta do zebow",
          userId: userId,
        },
      ],
    });
  });
  it("Should response with products", async () => {
    const result = await supertest(app)
      .get("/products")
      .set(testUtils.getAuthHeaderUser());
    expect(result.statusCode).toBe(200);
    expect(result.body).toBeDefined();
  });
  it("Should add product", async () => {
    const productPayload = JSON.stringify({
      sku: "12355",
      ean: "new ean",
      name: "new prod name",
    });
    const result = await supertest(app)
      .post("/products")
      .send(productPayload)
      .set(testUtils.getAuthHeaderUser())
      .set("content-type", "application/json");
    expect(result.statusCode).toBe(201);
    const dbResult = await prisma.product.findFirst({
      where: { sku: "12355" },
    });
    expect(dbResult).toBeDefined;
  });
  it("Should delete product", async () => {
    const productToBeDeleted = {
      ean: "123455",
      sku: "myskuuu",
      name: "productToBeDeleted",
      userId: testUserId,
    } as Product;
    const { id: createdProductId } = await prisma.product.upsert({
      create: productToBeDeleted,
      update: productToBeDeleted,
      where: {
        EanPerUser: { ean: productToBeDeleted.ean, userId: testUserId },
      },
      select: { id: true },
    });
    const response = await supertest(app)
      .del(`/products/${createdProductId}`)
      .set(testUtils.getAuthHeaderUser());
    expect(response.statusCode).toBe(204);
    const dbResult = await prisma.product.findUnique({
      where: { id: createdProductId },
    });
    expect(dbResult).toBeNull;
  });
});
