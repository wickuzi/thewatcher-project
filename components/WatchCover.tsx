"use client";
import { cn } from '@/lib/utils';
import React from 'react';
type WatchCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';

const variantStyles : Record<WatchCoverVariant, string> = {
  extraSmall: 'watch-cover_extra_small',
  small:'watch-cover_small',
  medium:'watch-cover_medium',
  regular:'watch-cover_regular',
  wide:'watch-cover_wide',
}
interface WatchCoverProps {
  className?: string;
  variant?: WatchCoverVariant;
  imageUrl: string;
}

const WatchCover = ({className, variant="regular", imageUrl="https://placehold.co/400x600.png"}: WatchCoverProps) => {
  // Debug: Log the image URL being used
  console.log('WatchCover - Image URL:', imageUrl);
  
  return (
    <div className={cn('relative transition-all duration-300 flex justify-center', variantStyles[variant], className,)}>
        
        {/* Contenedor de la carátula con estilo responsivo */}
        <div 
            className={cn(
                'relative z-10', 
                'w-[80%] max-w-[500px] h-[88%]',
                'rounded-lg',
                'mx-auto' // Centrado automático
            )} 
        >
          <img
            src={imageUrl}
            alt="cover"
            className='w-full h-full rounded-lg object-cover'
            loading="lazy"
            onError={(e) => {
              console.error('Error loading image. Original URL:', imageUrl, 'Error:', e);
              const target = e.target as HTMLImageElement;
              // Mostrar una imagen de respaldo si la carga falla
              console.log('Setting fallback image');
              target.src = 'https://placehold.co/400x600.png?text=Imagen+no+disponible';
            }}
            onLoad={() => console.log('Image loaded successfully:', imageUrl)}
          />
        </div>
    </div>
  ) 
}
export default WatchCover;