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

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID del reloj es requerido' },
        { status: 400 }
      );
    }

    const updateData = await request.json();
    
    // Verificar si el reloj existe
    const [existingWatch] = await db
      .select()
      .from(watchs)
      .where(eq(watchs.id, id));

    if (!existingWatch) {
      return NextResponse.json(
        { success: false, message: 'Reloj no encontrado' },
        { status: 404 }
      );
    }

    // Actualizar el reloj
    const [updatedWatch] = await db
      .update(watchs)
      .set({
        ...updateData,
        updatedAt: new Date()
      })
      .where(eq(watchs.id, id))
      .returning();

    // Registrar la actividad de actualización
    await db.insert(activities).values({
      type: 'watch_updated',
      watchId: id,
      details: {
        watchName: updatedWatch.name,
        changes: {
          ...(updateData.name && { name: { old: existingWatch.name, new: updateData.name } }),
          ...(updateData.price && { price: { old: existingWatch.price, new: updateData.price } }),
          ...(updateData.availableStock && { stock: { old: existingWatch.availableStock, new: updateData.availableStock } })
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Reloj actualizado exitosamente',
      watch: updatedWatch
    });

  } catch (error) {
    console.error('Error al actualizar el reloj:', error);
    return NextResponse.json(
      { success: false, message: 'Error al actualizar el reloj' },
      { status: 500 }
    );
  }
}
