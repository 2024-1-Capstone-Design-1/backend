import logger from "../utils/logger.js";

async function createBoardTable(client) {
  try {
    const query = `
        CREATE TABLE IF NOT EXISTS "boards" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "title" varchar NOT NULL,
            "detail" varchar NOT NULL,
            "deleted" boolean DEFAULT false NOT NULL,
            "created_at" timestamp NOT NULL,
            "deleted_at" timestamp,
            "user_id" INTEGER NOT NULL
        );
      
        CREATE TABLE IF NOT EXISTS "board_comments" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "comment" varchar NOT NULL,
            "deleted" boolean DEFAULT false NOT NULL,
            "created_at" timestamp NOT NULL,
            "deleted_at" timestamp,
            "user_id" INTEGER NOT NULL,
            "board_id" INTEGER NOT NULL
        );
      
        CREATE TABLE IF NOT EXISTS "board_depth_comments" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "comment" varchar NOT NULL,
            "deleted" boolean DEFAULT false NOT NULL,
            "created_at" timestamp NOT NULL,
            "deleted_at" timestamp,
            "user_id" INTEGER NOT NULL,
            "board_comment_id" INTEGER NOT NULL
        );
      
        CREATE TABLE IF NOT EXISTS "board_likes" (
            "id" SERIAL PRIMARY KEY NOT NULL,
            "user_id" INTEGER NOT NULL,
            "board_id" INTEGER NOT NULL
        );`;

    await client.query(query);

    logger.info("Board table created successfully");
  } catch (err) {
    logger.error("Error creating board table:", err);
  }
}

export default createBoardTable;
