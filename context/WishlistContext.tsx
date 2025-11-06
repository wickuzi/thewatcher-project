'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Watch } from '@/types';
import { useSession } from 'next-auth/react';

type WishlistContextType = {
  wishlist: Watch[];
  addToWishlist: (watch: Watch) => void;
  removeFromWishlist: (watchId: string) => void;
  isInWishlist: (watchId: string) => boolean;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<Watch[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  // Función para guardar la wishlist actual
  const saveWishlist = useCallback((currentWishlist: Watch[]) => {
    if (!isMounted) return;
    
    if (userId) {
      localStorage.setItem(`wishlist_${userId}`, JSON.stringify(currentWishlist));
      // Limpiar wishlist anónima si existe
      if (localStorage.getItem('wishlist_anonymous')) {
        localStorage.removeItem('wishlist_anonymous');
      }
    } else {
      localStorage.setItem('wishlist_anonymous', JSON.stringify(currentWishlist));
    }
  }, [isMounted, userId]);

  // Cargar wishlist cuando cambia el usuario o al montar
  useEffect(() => {
    const loadWishlist = () => {
      if (userId) {
        // Cargar wishlist del usuario
        const savedWishlist = localStorage.getItem(`wishlist_${userId}`);
        if (savedWishlist) {
          try {
            setWishlist(JSON.parse(savedWishlist));
            return;
          } catch (error) {
            console.error('Error al cargar la lista de deseos:', error);
          }
        }
      }
      
      // Si no hay usuario o no se pudo cargar la wishlist del usuario,
      // intentar cargar la wishlist anónima
      const anonymousWishlist = localStorage.getItem('wishlist_anonymous');
      if (anonymousWishlist) {
        try {
          setWishlist(JSON.parse(anonymousWishlist));
          // Si hay un usuario, migrar la wishlist anónima al usuario
          if (userId) {
            localStorage.setItem(`wishlist_${userId}`, anonymousWishlist);
            localStorage.removeItem('wishlist_anonymous');
          }
        } catch (error) {
          console.error('Error al cargar la lista de deseos anónima:', error);
        }
      } else if (wishlist.length === 0) {
        setWishlist([]);
      }
    };

    setIsMounted(true);
    loadWishlist();
  }, [userId]);

  // Guardar wishlist cuando cambia
  useEffect(() => {
    if (isMounted && wishlist) {
      saveWishlist(wishlist);
    }
  }, [wishlist, isMounted, saveWishlist]);
  
  // Manejar el cierre de sesión
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Guardar la wishlist actual antes de que la página se cierre
      if (wishlist && wishlist.length > 0) {
        localStorage.setItem('wishlist_anonymous', JSON.stringify(wishlist));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [wishlist]);

  const addToWishlist = (watch: Watch) => {
    setWishlist(prev => {
      // Evitar duplicados
      if (!prev.some(item => item.id === watch.id)) {
        return [...prev, watch];
      }
      return prev;
    });
  };

  const removeFromWishlist = (watchId: string) => {
    setWishlist(prev => prev.filter(watch => watch.id !== watchId));
  };

  const isInWishlist = (watchId: string) => {
    return wishlist.some(watch => watch.id === watchId);
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
