import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

// Configure WebSocket for serverless environment
if (typeof window === 'undefined') {
  neonConfig.webSocketConstructor = ws;
}

// Use the specified PostgreSQL database
const databaseUrl = "postgresql://neondb_owner:npg_ZNHf7uDlkF4S@ep-bitter-truth-a8glqli4-pooler.eastus2.azure.neon.tech/neondb?sslmode=require"; 
#//neondb_owner:npg_GSdqWJQ5u1DF@ep-lively-glade-a87ap18r-pooler.eastus2.azure.neon.tech/neondb?sslmode=require

console.log('Connecting to database...');

export const pool = new Pool({ 
  connectionString: databaseUrl,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle({ client: pool, schema });
