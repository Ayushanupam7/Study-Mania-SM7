-- Create users table
CREATE TABLE IF NOT EXISTS "users" (
  "id" SERIAL PRIMARY KEY,
  "username" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "name" VARCHAR(255) NOT NULL,
  "app_color" VARCHAR(50) NULL,
  "is_dark_mode" BOOLEAN NULL
);

-- Create subjects table
CREATE TABLE IF NOT EXISTS "subjects" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "description" TEXT NULL,
  "color_class" VARCHAR(50) NULL,
  "total_study_time" INTEGER NULL DEFAULT 0,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create flashcards table
CREATE TABLE IF NOT EXISTS "flashcards" (
  "id" SERIAL PRIMARY KEY,
  "question" TEXT NOT NULL,
  "answer" TEXT NOT NULL,
  "subject_id" INTEGER NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create planner_items table
CREATE TABLE IF NOT EXISTS "planner_items" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT NULL,
  "date" TIMESTAMP NOT NULL,
  "is_completed" BOOLEAN NULL DEFAULT false,
  "subject_id" INTEGER NULL REFERENCES "subjects"("id") ON DELETE SET NULL,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE
);

-- Create study_sessions table
CREATE TABLE IF NOT EXISTS "study_sessions" (
  "id" SERIAL PRIMARY KEY,
  "subject_id" INTEGER NOT NULL REFERENCES "subjects"("id") ON DELETE CASCADE,
  "user_id" INTEGER NOT NULL REFERENCES "users"("id") ON DELETE CASCADE,
  "date" TIMESTAMP NOT NULL,
  "duration" INTEGER NOT NULL,
  "comments" TEXT NULL
);

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS "subjects_user_id_idx" ON "subjects"("user_id");
CREATE INDEX IF NOT EXISTS "flashcards_subject_id_idx" ON "flashcards"("subject_id");
CREATE INDEX IF NOT EXISTS "flashcards_user_id_idx" ON "flashcards"("user_id");
CREATE INDEX IF NOT EXISTS "planner_items_date_idx" ON "planner_items"("date");
CREATE INDEX IF NOT EXISTS "planner_items_user_id_idx" ON "planner_items"("user_id");
CREATE INDEX IF NOT EXISTS "study_sessions_subject_id_idx" ON "study_sessions"("subject_id");
CREATE INDEX IF NOT EXISTS "study_sessions_user_id_idx" ON "study_sessions"("user_id");
CREATE INDEX IF NOT EXISTS "study_sessions_date_idx" ON "study_sessions"("date");