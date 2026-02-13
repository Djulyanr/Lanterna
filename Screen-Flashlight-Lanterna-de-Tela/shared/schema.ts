import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We primarily use localStorage for this offline-first app,
// but we'll set up a basic preferences table structure in case
// of future cloud sync requirements.
export const preferences = pgTable("preferences", {
  id: serial("id").primaryKey(),
  lastColor: text("last_color").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPreferencesSchema = createInsertSchema(preferences).pick({
  lastColor: true,
});

export type Preference = typeof preferences.$inferSelect;
export type InsertPreference = z.infer<typeof insertPreferencesSchema>;
