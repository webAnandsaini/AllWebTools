import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Import API handlers
import { setupTextToolsRoutes } from "./api/textTools";
import { setupPasswordToolsRoutes } from "./api/passwordTools";
import { setupQRCodeToolsRoutes } from "./api/qrcodeTools";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Register all tool routes
  setupTextToolsRoutes(app);
  setupPasswordToolsRoutes(app);
  setupQRCodeToolsRoutes(app);

  const httpServer = createServer(app);

  return httpServer;
}
