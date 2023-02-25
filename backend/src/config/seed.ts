import { PrismaClient } from "@prisma/client";
import Password from "../utils/password";
import dotenv from "dotenv";

async function main() {
  dotenv.config();
  const prisma = new PrismaClient();
  const adminMail = process.env.ADMIN_MAIL ?? "admin@gmail.com";

  if (await prisma.user.findUnique({ where: { email: adminMail } }))
    return console.log(`user with mail ${adminMail} already exists`);
  const passAsPlain = process.env.ADMIN_PASSWORD;
  if (!passAsPlain) throw new Error("ADMIN_PASSWORD is not defined in .env");
  const passHash = await Password.getPasswordHash(passAsPlain);
  await prisma.user.create({
    data: { name: "admin", email: adminMail, passwordHash: passHash },
  });
}
main()
  .then(() => console.log("Seeding finished"))
  .catch((err) => console.error("Error occured during seeding", err));
