'use client';

import React, { createContext, useState, useCallback, useEffect, useMemo, useRef, ReactNode, useContext } from 'react';
import { Watch } from '@/types';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

type WishlistContextType = {
  wishlist: Watch[];
  isLoading: boolean;
  addToWishlist: (watch: Watch) => Promise<void>;
  removeFromWishlist: (watchId: string) => Promise<void>;
  isInWishlist: (watchId: string) => boolean;
  refreshWishlist: () => Promise<void>;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Watch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { data: session, status } = useSession();
  const userId = session?.user?.id;
  const lastUserIdRef = useRef<string | undefined>(undefined);

  // Clave para identificar el almacenamiento local (memoizada para evitar recreaciones)
  const WISHLIST_STORAGE_KEY = useMemo(() => `wishlist_${userId || 'anonymous'}`, [userId]);

  // Cargar wishlist desde la API
  const fetchWishlist = useCallback(async () => {
    if (!userId) {
      setWishlist([]);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch(`/api/wishlist?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } else {
        throw new Error('Error al cargar la lista de deseos');
      }
    } catch (error) {
      console.error('Error al cargar la lista de deseos:', error);
      // Intentar cargar desde localStorage si hay un error
      if (typeof window !== 'undefined') {
        const cachedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
        if (cachedWishlist) {
          setWishlist(JSON.parse(cachedWishlist));
        }
      }
      toast.error('Error al cargar la lista de deseos');
    } finally {
      setIsLoading(false);
    }
  }, [userId, WISHLIST_STORAGE_KEY]);

  // Función para forzar una recarga de la lista de deseos
  const refreshWishlist = useCallback(async () => {
    if (!userId) {
      setWishlist([]);
      return;
    }

    try {
      setIsLoading(true);
      const timestamp = new Date().getTime();
      const response = await fetch(`/api/wishlist?userId=${userId}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setWishlist(data.wishlist || []);
      } else {
        throw new Error('Error al cargar la lista de deseos');
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.name !== 'AbortError') {
          console.error('Error al cargar la lista de deseos:', error);
          toast.error('Error al cargar la lista de deseos');
        }
      } else {
        console.error('Error desconocido al cargar la lista de deseos');
        toast.error('Error desconocido al cargar la lista de deseos');
      }
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  // Sincronizar wishlist entre pestañas y cargar cuando cambia la sesión
  useEffect(() => {
    // Esperar a que la sesión esté completamente cargada
    if (status === 'loading') {
      setIsLoading(true);
      return;
    }

    // Si no hay usuario autenticado, limpiar la wishlist
    if (!userId || status !== 'authenticated') {
      setWishlist([]);
      setIsLoading(false);
      lastUserIdRef.current = undefined;
      // Limpiar localStorage cuando no hay usuario
      if (typeof window !== 'undefined' && !userId) {
        localStorage.removeItem(WISHLIST_STORAGE_KEY);
      }
      return;
    }

    // Si el userId cambió o es la primera vez, cargar la wishlist
    const shouldLoad = lastUserIdRef.current !== userId;
    
    if (shouldLoad) {
      lastUserIdRef.current = userId;
      let isMounted = true;
      
      const loadWishlist = async () => {
        try {
          setIsLoading(true);
          const timestamp = new Date().getTime();
          const response = await fetch(`/api/wishlist?userId=${userId}&t=${timestamp}`, {
            cache: 'no-store',
            headers: {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': '0'
            }
          });

          if (!isMounted) return;

          if (response.ok) {
            const data = await response.json();
            setWishlist(data.wishlist || []);
            // Actualizar localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(data.wishlist || []));
            }
          } else {
            throw new Error('Error al cargar la lista de deseos');
          }
        } catch (error) {
          if (!isMounted) return;
          console.error('Error al cargar la lista de deseos:', error);
          // Intentar cargar desde localStorage si hay un error
          if (typeof window !== 'undefined') {
            const cachedWishlist = localStorage.getItem(WISHLIST_STORAGE_KEY);
            if (cachedWishlist) {
              try {
                setWishlist(JSON.parse(cachedWishlist));
              } catch (parseError) {
                console.error('Error al parsear wishlist del localStorage:', parseError);
              }
            }
          }
        } finally {
          if (isMounted) {
            setIsLoading(false);
          }
        }
      };

      // Pequeño delay para asegurar que la sesión esté completamente propagada
      // Esto es especialmente importante después del login
      const timer = setTimeout(() => {
        loadWishlist();
      }, 100);

      // Función para manejar el almacenamiento local
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
          try {
            const newWishlist = JSON.parse(e.newValue);
            setWishlist(newWishlist);
          } catch (error) {
            console.error('Error al analizar la lista de deseos del almacenamiento local:', error);
          }
        }
      };

      // Escuchar cambios en el almacenamiento local
      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageChange);
      }

      // Limpiar al desmontar
      return () => {
        isMounted = false;
        clearTimeout(timer);
        if (typeof window !== 'undefined') {
          window.removeEventListener('storage', handleStorageChange);
        }
      };
    } else {
      // Si el userId no cambió, solo configurar el listener de storage
      const handleStorageChange = (e: StorageEvent) => {
        if (e.key === WISHLIST_STORAGE_KEY && e.newValue) {
          try {
            const newWishlist = JSON.parse(e.newValue);
            setWishlist(newWishlist);
          } catch (error) {
            console.error('Error al analizar la lista de deseos del almacenamiento local:', error);
          }
        }
      };

      if (typeof window !== 'undefined') {
        window.addEventListener('storage', handleStorageChange);
      }

      return () => {
        if (typeof window !== 'undefined') {
          window.removeEventListener('storage', handleStorageChange);
        }
      };
    }
  }, [userId, status, WISHLIST_STORAGE_KEY]);

  // Función para agregar un reloj a la lista de deseos
  const addToWishlist = async (watch: Watch) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchId: watch.id, userId }),
      });

      if (!response.ok) {
        throw new Error('Error al agregar a la lista de deseos');
      }

      const data = await response.json();
      const updatedWishlist = [...wishlist, watch];
      setWishlist(updatedWishlist);
      
      // Actualizar localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
        // Disparar evento personalizado para sincronizar otras pestañas
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success('Añadido a tu lista de deseos');
    } catch (error) {
      console.error('Error al agregar a la lista de deseos:', error);
      toast.error('Error al agregar a la lista de deseos');
    }
  };

  // Función para eliminar un reloj de la lista de deseos
  const removeFromWishlist = async (watchId: string) => {
    if (!userId) return;

    try {
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ watchId, userId }),
      });

      if (!response.ok) {
        throw new Error('Error al eliminar de la lista de deseos');
      }

      const updatedWishlist = wishlist.filter(watch => watch.id !== watchId);
      setWishlist(updatedWishlist);
      
      // Actualizar localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(updatedWishlist));
        // Disparar evento personalizado para sincronizar otras pestañas
        window.dispatchEvent(new Event('storage'));
      }
      
      toast.success('Eliminado de tu lista de deseos');
    } catch (error) {
      console.error('Error al eliminar de la lista de deseos:', error);
      toast.error('Error al eliminar de la lista de deseos');
    }
  };

  // Función para verificar si un reloj está en la lista de deseos
  const isInWishlist = (watchId: string) => {
    return wishlist.some(watch => watch.id === watchId);
  };

  const value = {
    wishlist,
    isLoading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    refreshWishlist, // Exportar la función de actualización
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist debe usarse dentro de un WishlistProvider');
  }
  return context;
};
