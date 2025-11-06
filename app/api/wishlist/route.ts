import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { db } from '@/database/drizzle';
import { wishlists } from '@/database/schema';
import { and, eq } from 'drizzle-orm';

// Helper to parse request body
async function parseBody<T>(req: Request): Promise<T> {
  try {
    return await req.json();
  } catch (error) {
    throw new Error('Invalid JSON body');
  }
}

// Get user's wishlist
export async function GET(request: Request) {
  // Configurar encabezados para evitar caché
  const headers = new Headers();
  headers.set('Cache-Control', 'no-store, max-age=0');
  headers.set('Pragma', 'no-cache');
  headers.set('Expires', '0');

  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse(
        JSON.stringify({ message: 'No autorizado' }),
        { status: 401, headers }
      );
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const timestamp = searchParams.get('t'); // Usar timestamp para forzar actualización

    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: 'Se requiere el ID del usuario' }),
        { status: 400, headers }
      );
    }

    if (userId !== session.user.id) {
      return new NextResponse(
        JSON.stringify({ message: 'No autorizado' }),
        { status: 403, headers }
      );
    }

    // Forzar una nueva consulta a la base de datos sin usar caché
    const userWishlist = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, userId),
      with: {
        watch: true,
      },
    });

    return NextResponse.json({
      wishlist: userWishlist.map(item => item.watch).filter(Boolean),
    });
  } catch (error) {
    console.error('Error al obtener la lista de deseos:', error);
    return NextResponse.json(
      { 
        message: 'Error al obtener la lista de deseos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    );
  }
}

// Add to wishlist
export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { userId, watchId, watch } = await parseBody<{ userId: string; watchId: string; watch: any }>(request);

    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    // Check if already in wishlist
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.watchId, watchId)
      ),
    });

    if (existing) {
      return NextResponse.json(
        { message: 'Ya está en tu lista de deseos' },
        { status: 400 }
      );
    }

    // Add to wishlist
    await db
      .insert(wishlists)
      .values({
        userId,
        watchId,
      });

    return NextResponse.json({ watch });
  } catch (error) {
    console.error('Error al agregar a la lista de deseos:', error);
    return NextResponse.json(
      { 
        message: error instanceof Error ? error.message : 'Error al agregar a la lista de deseos',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Remove from wishlist
export async function DELETE(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 401 }
      );
    }

    const { userId, watchId } = await parseBody<{ userId: string; watchId: string }>(request);

    if (userId !== session.user.id) {
      return NextResponse.json(
        { message: 'No autorizado' },
        { status: 403 }
      );
    }

    await db
      .delete(wishlists)
      .where(
        and(
          eq(wishlists.userId, userId),
          eq(wishlists.watchId, watchId)
        )
      );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error al eliminar de la lista de deseos:', error);
    return NextResponse.json(
      { 
        message: 'Error al eliminar de la lista de deseos',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
