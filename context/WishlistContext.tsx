'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Watch } from '@/types';

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

  // Cargar wishlist desde localStorage al montar
  useEffect(() => {
    setIsMounted(true);
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist', error);
      }
    }
  }, []);

  // Guardar wishlist en localStorage cuando cambie
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }
  }, [wishlist, isMounted]);

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
