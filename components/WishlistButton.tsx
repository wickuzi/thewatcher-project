'use client';

import { Button } from "./ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useWishlist } from "@/context/WishlistContext";
import { Watch } from "@/types";
import { toast } from "sonner";

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
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const isWishlisted = isInWishlist(watch.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist(watch.id);
      toast.success("Eliminado de tu lista de deseos");
    } else {
      addToWishlist(watch);
      toast.success("Añadido a tu lista de deseos");
    }
  };

  return (
    <Button
      variant="default"
      size={size}
      onClick={handleClick}
      className={`watch-overview_btn flex-1 gap-2 ${className}`}
      aria-label={isWishlisted ? "Eliminar de la lista de deseos" : "Añadir a la lista de deseos"}
    >
      {isWishlisted ? (
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
