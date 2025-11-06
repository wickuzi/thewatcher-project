'use client';

import { Button } from "./ui/button";
import { Heart, HeartOff, Loader2 } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Watch } from "@/types";
import { useState } from "react";

interface WishlistButtonProps {
  watch: Watch;
  className?: string;
  variant?: "default" | "ghost" | "outline" | "secondary" | "destructive" | "link" | null | undefined;
  size?: "default" | "sm" | "lg" | "icon" | null | undefined;
}

export const WishlistButton = ({
  watch,
  className = "",
  variant = "outline",
  size = "default",
}: WishlistButtonProps) => {
  const { addToWishlist, removeFromWishlist, isInWishlist, isLoading } = useWishlist();
  const [isProcessing, setIsProcessing] = useState(false);
  const isWishlisted = isInWishlist(watch.id);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      if (isWishlisted) {
        await removeFromWishlist(watch.id);
      } else {
        await addToWishlist(watch);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <Button
        variant={variant}
        size={size}
        className={`watch-overview_btn flex-1 gap-2 ${className}`}
        disabled
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </Button>
    );
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      className={`watch-overview_btn flex-1 gap-2 ${className}`}
      disabled={isProcessing}
      aria-label={isWishlisted ? "Eliminar de la lista de deseos" : "Añadir a la lista de deseos"}
    >
      {isProcessing ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : isWishlisted ? (
        <>
          <HeartOff className="h-5 w-5" />
          <span className="font-bebas-neue text-lg text-dark-100">Quitar</span>
        </>
      ) : (
        <>
          <Heart className="h-5 w-5" />
          <span className="font-bebas-neue text-lg text-dark-100">Lista de deseos</span>
        </>
      )}
    </Button>
  );
};
