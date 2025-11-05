import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { sql } from 'drizzle-orm';

export async function GET() {
  try {
    // Get total number of watches
    const totalWatchesResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM watchs`
    );
    
    // Get count of low stock watches (assuming available_stock < 5 is low)
    const lowStockResult = await db.execute(
      sql`SELECT COUNT(*) as count FROM watchs WHERE available_stock < 5`
    );

    return NextResponse.json({
      success: true,
      count: Number(totalWatchesResult.rows[0].count),
      lowStockCount: Number(lowStockResult.rows[0].count)
    });
  } catch (error) {
    console.error('Error fetching watches count:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener el conteo de relojes' },
      { status: 500 }
    );
  }
}
