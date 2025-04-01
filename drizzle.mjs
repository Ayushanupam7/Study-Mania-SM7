#!/usr/bin/env node

import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import pkg from 'pg';
const { Pool } = pkg;
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory name of the current module
const __dirname = dirname(fileURLToPath(import.meta.url));

// Create a PostgreSQL pool connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Create the drizzle instance
const db = drizzle(pool);

// Run migrations
async function main() {
  console.log("Running migrations...");
  
  // Create migrations directory if it doesn't exist
  try {
    const migrationsFolder = join(__dirname, "drizzle");
    await migrate(db, { migrationsFolder });
    console.log("Migrations completed successfully!");
  } catch (error) {
    console.error("Error running migrations:", error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();