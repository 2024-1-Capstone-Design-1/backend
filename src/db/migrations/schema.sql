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
  "id" SERIAL PRIMARY KEY NOT NULL,
  "nickname" varchar UNIQUE NOT NULL,
  "image_url" varchar,
  "email" varchar UNIQUE NOT NULL,
  "password" varchar NOT NULL,
  "role" role DEFAULT 'general' NOT NULL,
  "deleted" boolean DEFAULT false NOT NULL,
  "created_at" timestamp NOT NULL,
  "deleted_at" timestamp
);

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
);

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
);

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
