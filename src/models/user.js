import logger from "../utils/logger.js";

async function createUserTable(client) {
  try {
    const query = `
        DO $$
        BEGIN
            IF NOT EXISTS (
                SELECT 1
                FROM pg_type t
                JOIN pg_enum e ON t.oid = e.enumtypid
                WHERE t.typname = 'role'
            ) THEN
                CREATE TYPE "role" AS ENUM (
                    'general',
                    'admin'
                );
            END IF;
        END $$;
                
        CREATE TABLE IF NOT EXISTS "users" (
          "id" SERIAL PRIMARY KEY,
          "email" varchar UNIQUE NOT NULL,
          "username" varchar,
          "nickname" varchar UNIQUE NOT NULL,
          "profile_image" varchar,
          "subdomain" varchar UNIQUE,
          "role" role DEFAULT 'general' NOT NULL,
          "deleted" boolean DEFAULT false NOT NULL,
          "created_at" timestamp,
          "deleted_at" timestamp
        );
      `;

    await client.query(query);

    logger.info("User table created successfully");
  } catch (err) {
    logger.error("Error creating user table:", err);

    throw err;
  }
}

export default createUserTable;
