import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure neon to use websockets
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create connection pool
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create drizzle client
export const db = drizzle(pool, { schema });

// When the application is shutting down, close the pool
process.on('beforeExit', () => {
  console.log('Closing connection pool');
  pool.end();
});