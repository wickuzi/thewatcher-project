import { watchs } from "@/database/schema";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { config } from "dotenv";
import appConfig from "@/lib/config";

// Load environment variables
config({ path: ".env.local" });

// Check if required environment variables are set
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL is not set in .env.local");
    process.exit(1);
}

// Initialize database connection
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function checkWatches() {
  try {
    console.log("🔍 Buscando relojes en la base de datos...");
    const allWatches = await db.select().from(watchs);
    
    if (allWatches.length === 0) {
      console.log("❌ No se encontraron relojes en la base de datos");
      return;
    }

    console.log(`\n✅ Se encontraron ${allWatches.length} relojes en la base de datos:\n`);
    allWatches.forEach((watch: any, index: number) => {
      console.log(`${index + 1}. ${watch.name}`);
      console.log(`   ID: ${watch.id}`);
      console.log(`   URL: ${appConfig.env.apiEndpoint}/watch/${watch.id}\n`);
    });
  } catch (error) {
    console.error("❌ Error al buscar relojes:", error);
  } finally {
    process.exit(0);
  }
}

checkWatches();
