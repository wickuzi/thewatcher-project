import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { sql } from 'drizzle-orm';
import { withCors } from '@/lib/cors';

async function handler() {
  try {
    console.log('Fetching users count...');
    // Get total number of users (excluding admin users)
    const result = await db.execute(
      sql`SELECT COUNT(*) as count FROM users WHERE role != 'ADMIN'`
    );
    
    console.log('Users count result:', result);

    return NextResponse.json({
      success: true,
      count: Number(result.rows[0].count)
    });
  } catch (error: unknown) {
    console.error('Error fetching users count:');
    const errorMessage = error instanceof Error ? {
      message: error.message,
      stack: error.stack,
      name: error.name
    } : 'Unknown error';
    
    console.error('Error details:', errorMessage);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener el conteo de usuarios',
        details: process.env.NODE_ENV === 'development' && error instanceof Error 
          ? error.message 
          : undefined
      },
      { status: 500 }
    );
  }
}

export const GET = withCors(handler);
