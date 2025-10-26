"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Mostrar el error completo en la consola para depuración
    console.error('Authentication error:', error);
    
    // Mostrar el mensaje de error completo al usuario
    const errorMessage = error.message || 'Ocurrió un error inesperado';
    
    // Mostrar el mensaje de error como texto preformateado
    toast.error(
      <div className="text-left">
        <pre className="whitespace-pre-wrap break-all">{errorMessage}</pre>
      </div>,
      { duration: 10000 } // Mostrar por 10 segundos
    );
    
    // Redirigir a la página de inicio de sesión después de mostrar el error
    const timer = setTimeout(() => {
      router.push('/sign-in');
    }, 100);

    return () => clearTimeout(timer);
  }, [error, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Toaster position="top-center" />
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Algo salió mal</h2>
        <p className="text-gray-300 mb-4">
          Estamos teniendo problemas para procesar tu solicitud.
        </p>
        <button
          onClick={() => {
            reset();
            router.push('/sign-in');
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
}
