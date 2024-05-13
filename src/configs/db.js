import pkg from "pg";
import dotenv from "dotenv";

import logger from "../utils/logger.js";
import createUserTable from "../models/user.js";
import createBoardTable from "../models/board.js";
import createTemplateTable from "../models/template.js";
import alterTablesToAddForeignKeys from "../models/alterTable.js";
import createBlogTable from "../models/blog.js";

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function initDatabase() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await createUserTable(client);
    await createBlogTable(client);
    await createBoardTable(client);
    await createTemplateTable(client);
    await alterTablesToAddForeignKeys(client);

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
