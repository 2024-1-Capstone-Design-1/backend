import logger from "../utils/logger.js";

async function createBlogTable(client) {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS "blogs" (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER NOT NULL,
            "template_id" INTEGER NOT NULL,
            "created_at" timestamp
        );
  `;

    await client.query(query);

    logger.info("blog table created successfully");
  } catch (err) {
    logger.error("Error creating blog table:", err);

    throw err;
  }
}

export default createBlogTable;
