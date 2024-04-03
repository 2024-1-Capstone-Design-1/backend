import express from "express";
import morgan from "morgan";

import logger from "./utils/logger.js";
import { initDatabase } from "./db/init.js";

const app = express();
const port = 3000;

app.use(morgan("dev"));

await initDatabase();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info(`App listening on http://localhost:${port}`);
});
