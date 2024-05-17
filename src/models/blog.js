import logger from "../utils/logger.js";

async function createBlogTable(client) {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS "blogs" (
            "id" SERIAL PRIMARY KEY,
            "user_id" INTEGER NOT NULL,
            "template_id" INTEGER NOT NULL,
            "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
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
