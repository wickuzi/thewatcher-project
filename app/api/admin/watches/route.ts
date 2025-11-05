import { NextResponse } from 'next/server';
import { db } from '@/database/drizzle';
import { watchs, activities } from '@/database/schema';
import { eq, and, gte } from 'drizzle-orm';

export async function GET() {
  try {
    const allWatches = await db.select().from(watchs);
    return NextResponse.json(allWatches);
  } catch (error) {
    console.error('Error fetching watches:', error);
    return NextResponse.json(
      { message: 'Error al obtener los relojes' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();

    // Verificar si el reloj existe y tiene stock
    const [watch] = await db
      .select()
      .from(watchs)
      .where(
        and(
          eq(watchs.id, id),
          gte(watchs.availableStock, 1)
        )
      );

    if (!watch) {
      return NextResponse.json(
        { success: false, message: 'Reloj no encontrado o sin stock disponible' },
        { status: 404 }
      );
    }

    // Actualizar el stock restando 1
    const [updatedWatch] = await db
      .update(watchs)
      .set({ availableStock: watch.availableStock - 1 })
      .where(eq(watchs.id, id))
      .returning();

    // Registrar la actividad de venta
    await db.insert(activities).values({
      type: 'watch_sold',
      watchId: id,
      details: {
        watchName: updatedWatch.name,
        remaining: updatedWatch.availableStock - 1
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Venta registrada exitosamente',
      watch: updatedWatch
    });

  } catch (error) {
    console.error('Error al registrar venta:', error);
    return NextResponse.json(
      { success: false, message: 'Error al registrar la venta' },
      { status: 500 }
    );
  }
}
