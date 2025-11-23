'use client';

import React, { useEffect, useState } from "react";
import WatchList from "@/components/WatchList";
import { SignOutButton } from "@/components/SignOutButton";
import { useWishlist } from "@/context/WishlistContext";
import { Watch } from "@/types";
import { Button } from "@/components/ui/button";
import { HeartOff, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ProfilePage = () => {
  const { wishlist, removeFromWishlist, isLoading } = useWishlist();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleRemoveFromWishlist = (watchId: string) => {
    removeFromWishlist(watchId);
    toast.success("Eliminado de tu lista de deseos");
  };

  if (!isClient || isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
        <p className="text-light-100">Recarga la página si no cargan tus relojes.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-4xl font-bebas-neue text-light-100 mb-2">Mi Perfil</h1>
          <p className="text-light-200">
            {wishlist.length} {wishlist.length === 1 ? 'reloj' : 'relojes'} en tu lista de deseos
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <SignOutButton />
        </div>
      </div>

      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlist.map((watch: Watch) => (
            <div key={watch.id} className="group bg-dark-300 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <a 
                href={`/watch/${watch.id}`}
                className="flex-1 flex flex-col"
                onClick={(e) => {
                  // Solo prevenir el comportamiento por defecto si se hace clic en un botón dentro del enlace
                  if ((e.target as HTMLElement).closest('button')) {
                    e.preventDefault();
                  }
                }}
              >
                <div className="relative h-64 flex-shrink-0">
                  <img
                    src={watch.imageUrl}
                    alt={watch.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="w-full">
                      <h3 className="text-white font-semibold text-lg">{watch.name}</h3>
                      <p className="text-light-200 text-sm">{watch.brand}</p>
                      <p className="text-primary font-bold mt-2">C$ {watch.price.toLocaleString('es-NI')}</p>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="text-light-100 font-medium truncate">{watch.name}</h3>
                  <p className="text-light-200 text-sm">{watch.brand}</p>
                  <p className="text-primary font-bold mt-1">C$ {watch.price.toLocaleString('es-NI')}</p>
                </div>
              </a>
              <div className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full bg-transparent border-light-200 text-light-100 hover:bg-primary/10 hover:border-primary hover:text-primary"
                  onClick={() => handleRemoveFromWishlist(watch.id)}
                >
                  <HeartOff className="h-4 w-4 mr-2" />
                  Quitar de la lista
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border-2 border-dashed border-gray-700 rounded-lg">
          <HeartOff className="h-12 w-12 mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-medium text-light-100 mb-2">Tu lista de deseos está vacía</h3>
          <p className="text-light-200 mb-6">Guarda tus relojes favoritos para verlos aquí</p>
          <a 
            href="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50"
          >
            Explorar relojes
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
