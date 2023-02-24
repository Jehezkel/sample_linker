import * as dotenv from "dotenv";
import express from "express";

dotenv.config();

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 7000;
const app = express();

app.use(express.json());

app.get("/", (req, res) => res.status(200).send("IT WORKS"));

app.listen(PORT, () => {
  console.log(`Server listening on:\nhttp://localhost:${PORT}`);
});
