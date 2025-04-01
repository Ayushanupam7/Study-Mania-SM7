import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
const { Pool } = pg;
import * as schema from '@shared/schema';

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Drizzle instance
export const db = drizzle(pool, { schema });

// Function to initialize the database
export async function initializeDatabase() {
  try {
    console.log('Testing database connection...');
    
    // Test connection
    const client = await pool.connect();
    client.release();
    
    console.log('Database connection successful.');
    
    // Import the main function from migrate.ts to initialize the database with default data
    const { main } = await import('./migrate');
    
    // Create or verify database data
    const result = await main();
    
    return result;
  } catch (error) {
    console.error('Database initialization error:', error);
    return false;
  }
}