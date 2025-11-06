import config from "@/lib/config";
import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from "@neondatabase/serverless";
import * as schema from './schema';

const sql = neon(config.env.databaseUrl);

// Export the database client with the schema type
export const db = drizzle(sql, { schema });

// Export all schema types
export * from './schema';
