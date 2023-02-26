import express from "express";
import dotenv from "dotenv";
import routes from "./routes";

dotenv.config();

export const app = express();
app.use(express.json());

// app.get("/", (req, res) => res.status(200).send("IT WORKS"));
app.use("/", routes);
// export default app;
