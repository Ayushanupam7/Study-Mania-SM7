import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  appColor: text("app_color").default("blue"),
  isDarkMode: boolean("is_dark_mode").default(false),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  appColor: true,
  isDarkMode: true,
});

// Subject table
export const subjects = pgTable("subjects", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  colorClass: text("color_class").default("border-blue-500"),
  totalStudyTime: integer("total_study_time").default(0),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const insertSubjectSchema = createInsertSchema(subjects).pick({
  name: true,
  description: true,
  colorClass: true,
  userId: true,
});

// Flashcard table
export const flashcards = pgTable("flashcards", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const insertFlashcardSchema = createInsertSchema(flashcards).pick({
  question: true,
  answer: true,
  subjectId: true,
  userId: true,
});

// Planner Item table
export const plannerItems = pgTable("planner_items", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  date: timestamp("date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  subjectId: integer("subject_id").references(() => subjects.id, { onDelete: "set null" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const insertPlannerItemSchema = createInsertSchema(plannerItems).pick({
  title: true,
  description: true,
  date: true,
  isCompleted: true,
  subjectId: true,
  userId: true,
});

// Study Session table
export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  subjectId: integer("subject_id").notNull().references(() => subjects.id, { onDelete: "cascade" }),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  date: timestamp("date").notNull(),
  duration: integer("duration").notNull(),
  comments: text("comments"),
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  subjectId: true,
  userId: true,
  date: true,
  duration: true,
  comments: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSubject = z.infer<typeof insertSubjectSchema>;
export type Subject = typeof subjects.$inferSelect;

export type InsertFlashcard = z.infer<typeof insertFlashcardSchema>;
export type Flashcard = typeof flashcards.$inferSelect;

export type InsertPlannerItem = z.infer<typeof insertPlannerItemSchema>;
export type PlannerItem = typeof plannerItems.$inferSelect;

export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type StudySession = typeof studySessions.$inferSelect;

// Countdown table
export const countdowns = pgTable("countdowns", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  duration: integer("duration").notNull(),
  userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const insertCountdownSchema = createInsertSchema(countdowns).pick({
  name: true,
  duration: true,
  userId: true,
});

export type InsertCountdown = z.infer<typeof insertCountdownSchema>;
export type Countdown = typeof countdowns.$inferSelect;
