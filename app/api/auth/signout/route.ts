import { NextResponse } from 'next/server';
import { auth, signOut } from '@/auth';

export async function POST() {
  try {
    // Obtener la sesión actual
    const session = await auth();
    
    // Si hay una sesión activa, cerrarla
    if (session) {
      await signOut({ redirect: false });
    }

    // Crear respuesta exitosa
    const response = NextResponse.json(
      { success: true, message: 'Sesión cerrada correctamente' },
      { status: 200 }
    );

    // Limpiar cookies de autenticación
    response.cookies.set({
      name: 'next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
    });

    response.cookies.set({
      name: '__Secure-next-auth.session-token',
      value: '',
      expires: new Date(0),
      path: '/',
      secure: true,
    });

    return response;
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    return NextResponse.json(
      { success: false, error: 'Error al cerrar la sesión' },
      { status: 500 }
    );
  }
}
