import logger from "../utils/logger.js";

async function createTemplateTable(client) {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS "templates" (
        "id" SERIAL PRIMARY KEY,
        "name" varchar NOT NULL,
        "thumbnail" varchar NOT NULL,
        "code" jsonb NOT NULL,
        "share" boolean DEFAULT false NOT NULL,
        "deleted" boolean DEFAULT false NOT NULL,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "template_images" (
        "id" SERIAL PRIMARY KEY,
        "image" varchar NOT NULL,
        "template_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "template_comments" (
        "id" SERIAL PRIMARY KEY,
        "comment" varchar NOT NULL,
        "deleted" boolean DEFAULT false,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL,
        "template_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "template_depth_comments" (
        "id" SERIAL PRIMARY KEY,
        "comment" varchar NOT NULL,
        "deleted" boolean DEFAULT false,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL,
        "template_comment_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "template_likes" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "template_id" INTEGER NOT NULL
      );
    `;

    await client.query(query);

    logger.info(`Template table created successfully`);
  } catch (err) {
    logger.error(`Error creating template table: ${err.message}`);

    throw err;
  }
}

export default createTemplateTable;
