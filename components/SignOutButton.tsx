"use client";

import { Button } from "@/components/ui/button";

export function SignOutButton() {
  const handleSignOut = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    try {
      // 1. Llamar al endpoint de cierre de sesión
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Error al cerrar sesión');
      }
      
      // 2. Limpiar el almacenamiento local
      localStorage.clear();
      sessionStorage.clear();
      
      // 3. Forzar recarga completa a la página de inicio
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // En caso de error, redirigir de todos modos
      window.location.href = '/';
    }
  };

  return (
    <Button 
      onClick={handleSignOut}
      className="mb-10"
      type="button"
    >
      Cerrar Sesión
    </Button>
  );
}