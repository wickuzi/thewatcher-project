import { cn } from '@/lib/utils';
import React from 'react'
import Image from 'next/image'

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
  coverColor: string;
  coverImage: string;
}

const WatchCover = ({className, variant="regular", coverColor="#12141d", coverImage="https://placehold.co/400x600.png"}: WatchCoverProps) => {
  return (
    <div className={cn('relative transition-all duration-300', variantStyles[variant], className,)}>
   
        
        {/* Contenedor de la carátula con estilo responsivo para 'left' */}
        <div 
            className={cn(
                'absolute z-10', 
                'left-[5%]', 
                'lg:left-[12%]', 
                'w-[87.5%] h-[88%]', 
                'rounded-lg'
            )} 
        >
          <Image 
            src={coverImage} 
            alt="cover" 
            fill 
            unoptimized
            // 💡 ARREGLO: Cambiado de object-fill a object-cover para mantener la proporción y evitar estiramiento
            className='rounded-lg object-cover'
            // Prop 'sizes' obligatorio con 'fill' para rendimiento
            sizes="(max-width: 768px) 100vw, 33vw" 
          />
        </div>
    </div>
  ) 
}
export default WatchCover;