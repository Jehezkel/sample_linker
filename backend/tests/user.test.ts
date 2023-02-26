// import { describe } from "node:test";
import supertest from "supertest";
import { app } from "../src/app";
import testUtils from "./test.utils";

describe("User endpoints", () => {});
describe("Auth middleware", () => {
  it("should respond with 400 when malformed token", async () => {
    const tokenHeader = testUtils.getAuthHeaderUser();
    tokenHeader["x-access-token"] += "sometraash";
    const response = await supertest(app).get("/user/check").set(tokenHeader);
    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe("Invalid token");
  });
  it("should respond with 401 without token", async () => {
    const result = await supertest(app).get("/user/check");
    expect(result.statusCode).toBe(403);
  });
  it("should respond with 200 with token", async () => {
    const result = await supertest(app)
      .get("/user/check")
      .set(testUtils.getAuthHeaderUser());
    expect(result.statusCode).toBe(200);
  });
});
