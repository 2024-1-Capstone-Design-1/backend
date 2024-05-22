import logger from "../utils/logger.js";

async function createBoardTable(client) {
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS "boards" (
        "id" SERIAL PRIMARY KEY,
        "title" varchar NOT NULL,
        "detail" varchar NOT NULL,
        "deleted" boolean DEFAULT false,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL,
        "blog_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "board_images" (
        "id" SERIAL PRIMARY KEY,
        "image" varchar NOT NULL,
        "board_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "board_comments" (
        "id" SERIAL PRIMARY KEY,
        "comment" varchar NOT NULL,
        "deleted" boolean DEFAULT false,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL,
        "board_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "board_depth_comments" (
        "id" SERIAL PRIMARY KEY,
        "comment" varchar NOT NULL,
        "deleted" boolean DEFAULT false,
        "created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
        "deleted_at" timestamp,
        "user_id" INTEGER NOT NULL,
        "board_comment_id" INTEGER NOT NULL
      );
      
      CREATE TABLE IF NOT EXISTS "board_likes" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL,
        "board_id" INTEGER NOT NULL
      );
    `;

    await client.query(query);

    logger.info(`Board table created successfully`);
  } catch (err) {
    logger.error(`Error creating board table: ${err.message}`);

    throw err;
  }
}

export default createBoardTable;
