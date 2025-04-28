import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - for future login functionality
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Tool usage records - for tracking popular tools
export const toolUsages = pgTable("tool_usages", {
  id: serial("id").primaryKey(),
  toolSlug: text("tool_slug").notNull(),
  userId: integer("user_id").references(() => users.id), // Optional, only if user is logged in
  usedAt: timestamp("used_at").defaultNow().notNull(),
  ipAddress: text("ip_address"),
});

export const insertToolUsageSchema = createInsertSchema(toolUsages).pick({
  toolSlug: true,
  userId: true,
  ipAddress: true,
});

// Saved results - for users to save their tool results
export const savedResults = pgTable("saved_results", {
  id: serial("id").primaryKey(),
  toolSlug: text("tool_slug").notNull(),
  userId: integer("user_id").references(() => users.id).notNull(),
  resultData: text("result_data").notNull(), // Stored as JSON string
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSavedResultSchema = createInsertSchema(savedResults).pick({
  toolSlug: true,
  userId: true,
  resultData: true,
  name: true,
});

// Newsletter subscribers
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  isActive: boolean("is_active").default(true).notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(newsletterSubscribers).pick({
  email: true,
});

// Type definitions
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertToolUsage = z.infer<typeof insertToolUsageSchema>;
export type ToolUsage = typeof toolUsages.$inferSelect;

export type InsertSavedResult = z.infer<typeof insertSavedResultSchema>;
export type SavedResult = typeof savedResults.$inferSelect;

export type InsertNewsletterSubscriber = z.infer<typeof insertNewsletterSubscriberSchema>;
export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
