import express from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import swaggerUi from "swagger-ui-express";
import cors from "cors";

import logger from "./utils/logger.js";
import specs from "./swagger/swagger.js";
import { initDatabase } from "./configs/db.js";
import authRouter from "./routes/authRoute.js";
import userRouter from "./routes/userRoute.js";
import blogRouter from "./routes/blogRoute.js";
import templateRouter from "./routes/templateRoute.js";

const app = express();
const port = 3001;

app.use(morgan("dev"));

app.use(
  cors({
    origin: "*",
    credentials: true,
    optionsSuccessStatus: 200,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    maxAge: 86400,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/blog", blogRouter);
app.use("/template", templateRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

await initDatabase();

app.listen(port, () => {
  logger.info(`App listening on http://localhost:${port}`);
});
