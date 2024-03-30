import pkg from "pg";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import logger from "../utils/logger.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function connectDB() {
  try {
    const client = await pool.connect();

    logger.info("Database connection was successful!");

    return client;
  } catch (err) {
    logger.error("Database connection failed, retrying...", err);

    setTimeout(connectDB, 3000);
  }
}

async function initDatabase() {
  const client = await connectDB();

  try {
    const schema = fs.readFileSync(
      path.join(__dirname, "migrations", "schema.sql"),
      "utf-8"
    );

    await client.query("BEGIN");
    await client.query(schema);
    await client.query("COMMIT");

    logger.info("Database initialized successfully.");
  } catch (err) {
    await client.query("ROLLBACK");

    logger.error("Error initializing database:", err);
  } finally {
    client.release();
  }
}

export { pool, initDatabase };
