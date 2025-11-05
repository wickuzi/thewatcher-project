import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { activities, users, watchs } from '@/database/schema';
import { desc, eq, and } from 'drizzle-orm';

export async function GET() {
  try {
    // Obtener solo las actividades de venta
    const sales = await db
      .select({
        id: activities.id,
        type: activities.type,
        watchName: watchs.name,
        watchId: activities.watchId,
        price: watchs.price, // Precio de venta
        cost: watchs.cost,   // Costo del producto
        details: activities.details,
        date: activities.createdAt,
        soldBy: users.fullName,
      })
      .from(activities)
      .leftJoin(users, eq(activities.userId, users.id))
      .leftJoin(watchs, eq(activities.watchId, watchs.id))
      .where(eq(activities.type, 'watch_sold'))
      .orderBy(desc(activities.createdAt))
      .limit(50); // Últimas 50 ventas

    return NextResponse.json({ success: true, sales });
  } catch (error) {
    console.error('Error fetching sales:', error);
    return NextResponse.json(
      { success: false, error: 'Error al obtener las ventas' },
      { status: 500 }
    );
  }
}
