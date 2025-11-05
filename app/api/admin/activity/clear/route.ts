import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { activities } from '@/database/schema';
import { eq } from 'drizzle-orm';

export async function DELETE() {
  try {
    // Delete all activities
    await db.delete(activities);
    
    return NextResponse.json({ 
      success: true,
      message: 'Todas las actividades han sido eliminadas'
    });
  } catch (error) {
    console.error('Error clearing activities:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al limpiar las actividades' 
      },
      { status: 500 }
    );
  }
}
