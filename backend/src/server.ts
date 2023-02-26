// import * as dotenv from "dotenv";
// import express from "express";
// import routes from "./routes";
import { app } from "./app";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 7000;
app.listen(PORT, () => {
  console.log(`Server listening on:\nhttp://localhost:${PORT}`);
});
