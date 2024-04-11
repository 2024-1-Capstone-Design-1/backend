import logger from "../utils/logger.js";

async function alterTablesToAddForeignKeys(client) {
  try {
    const query = `
        ALTER TABLE "boards" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "board_comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "board_comments" ADD FOREIGN KEY ("board_id") REFERENCES "boards" ("id");
        ALTER TABLE "board_depth_comments" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "board_depth_comments" ADD FOREIGN KEY ("board_comment_id") REFERENCES "board_comments" ("id");
        ALTER TABLE "board_likes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "board_likes" ADD FOREIGN KEY ("board_id") REFERENCES "boards" ("id");
        ALTER TABLE "templates" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "template_likes" ADD FOREIGN KEY ("user_id") REFERENCES "users" ("id");
        ALTER TABLE "template_likes" ADD FOREIGN KEY ("template_id") REFERENCES "templates" ("id");
    `;

    await client.query(query);

    logger.info("Foreign keys added successfully");
  } catch (err) {
    logger.error("Error adding foreign keys:", err);
  }
}

export default alterTablesToAddForeignKeys;
