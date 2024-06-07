import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import logger from "./utils/logger.js";
import specs from "./swagger/swagger.js";
import { initDatabase } from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import blogRouter from "./routes/blogRoute.js";
import templateRouter from "./routes/templateRoute.js";

const app = express();
const port = 3001;

app.use(morgan("dev"));

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRouter);
app.use("/blog", blogRouter);
app.use("/template", templateRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

await initDatabase();

app.listen(port, () => {
  logger.info(`App listening on http://localhost:${port}`);
});
