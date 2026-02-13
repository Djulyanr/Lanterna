import { db } from "./db";
import {
  preferences,
  type InsertPreference,
  type Preference,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getPreferences(id: number): Promise<Preference | undefined>;
  updatePreferences(pref: InsertPreference): Promise<Preference>;
}

export class DatabaseStorage implements IStorage {
  async getPreferences(id: number): Promise<Preference | undefined> {
    const [pref] = await db.select().from(preferences).where(eq(preferences.id, id));
    return pref;
  }

  async updatePreferences(pref: InsertPreference): Promise<Preference> {
    // For this simple app, we just insert a log. In a real app we'd update a user record.
    const [newPref] = await db.insert(preferences).values(pref).returning();
    return newPref;
  }
}

export const storage = new DatabaseStorage();
