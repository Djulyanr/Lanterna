import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Simple health check or sync endpoint
  app.post(api.preferences.sync.path, async (req, res) => {
    // In a real app we'd sync this to the DB
    // const result = await storage.updatePreferences(req.body);
    res.json({ success: true });
  });

  return httpServer;
}
