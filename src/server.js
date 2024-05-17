import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";

import logger from "./utils/logger.js";
import { initDatabase } from "./configs/db.js";
import authRouter from "./routes/authRoute.js";

const app = express();
const port = 3000;

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/auth", authRouter);

await initDatabase();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  logger.info(`App listening on http://localhost:${port}`);
});
