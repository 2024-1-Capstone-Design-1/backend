import logger from "../utils/logger.js";

async function createTemplateTable(client) {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS "templates" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "name" varchar NOT NULL,
            "thumbnail_url" varchar NOT NULL,
            "code_url" varchar NOT NULL,
            "deleted" boolean DEFAULT false NOT NULL,
            "created_at" timestamp NOT NULL,
            "deleted_at" timestamp,
            "user_id" INTEGER NOT NULL
        );
        
        CREATE TABLE IF NOT EXISTS "template_likes" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "user_id" INTEGER NOT NULL,
            "template_id" INTEGER NOT NULL
        );`;

    await client.query(query);

    logger.info("Template table created successfully");
  } catch (err) {
    logger.error("Error creating template table:", err);
  }
}

export default createTemplateTable;
