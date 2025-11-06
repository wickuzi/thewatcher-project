import { db } from '../database/drizzle';
import { sql } from 'drizzle-orm';

async function checkWishlistTable() {
  try {
    // Check if the wishlists table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'wishlists'
      );
    `);
    
    console.log('Wishlists table exists:', result.rows[0]?.exists || false);
    
    // If table exists, show its structure
    if (result.rows[0]?.exists) {
      const columns = await db.execute(sql`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'wishlists';
      `);
      
      console.log('\nWishlists table structure:');
      console.table(columns.rows);
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking wishlist table:', error);
    process.exit(1);
  }
}

checkWishlistTable();
