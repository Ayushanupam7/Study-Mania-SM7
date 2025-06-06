import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from './db';
import { MemStorage, storage, IStorage } from './storage';
import { DatabaseStorage } from './DatabaseStorage';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Choose storage implementation based on DATABASE_URL environment variable
let storageImplementation: IStorage = storage;

if (process.env.DATABASE_URL) {
  log('Using PostgreSQL storage implementation');
  storageImplementation = new DatabaseStorage();
} else {
  log('Using in-memory storage implementation');
  storageImplementation = new MemStorage();
}

// Export the storage instance for use in routes
export { storageImplementation as storage };

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize database if PostgreSQL is configured
  if (process.env.DATABASE_URL) {
    const dbInitialized = await initializeDatabase();
    if (!dbInitialized) {
      log('WARNING: Database initialization failed. Falling back to in-memory storage.');
      storageImplementation = new MemStorage();
    }
  }

  const server = await registerRoutes(app);

  // Error handling middleware
  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  // Setup Vite only in development
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Use regular listen() syntax for Windows compatibility (remove reusePort)
  const port = 3000;
  server.listen(port, "127.0.0.1", () => {
    log(`serving on port ${port}`);
  });
})();
