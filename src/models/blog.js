import logger from "../utils/logger.js";

async function createBlogTable(client) {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS "blogs" (
          "id" SERIAL PRIMARY KEY,
          "name" varchar NOT NULL,
          "subdomain" varchar NOT NULL UNIQUE,
          "user_id" INTEGER NOT NULL,
          "template_id" INTEGER NOT NULL,
          "deleted" boolean DEFAULT false NOT NULL,
          "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
          "deleted_at" timestamp
      );
  `;

    await client.query(query);

    logger.info(`Blog table created successfully`);
  } catch (err) {
    logger.error(`Error creating blog table: ${err.messasge}`);

    throw err;
  }
}

export default createBlogTable;
