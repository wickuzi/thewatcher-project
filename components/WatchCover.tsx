"use client";
import { cn } from '@/lib/utils';
import React from 'react';
type WatchCoverVariant = 'extraSmall' | 'small' | 'medium' | 'regular' | 'wide';
import { Lens } from "@/components/ui/lens";

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
    <div className={cn('relative transition-all duration-300 flex justify-center', variantStyles[variant], className)}>
        <div className={cn(
            'relative z-10', 
            'w-[80%] max-w-[500px] h-[88%]',
            'rounded-lg',
            'mx-auto',
            'overflow-hidden',
            'group'
        )}>
            <div className="relative w-full h-full">
                <img
                    src={imageUrl}
                    alt="cover"
                    className='w-full h-full rounded-lg object-cover transition-transform duration-500 ease-out group-hover:scale-110'
                    loading="lazy"
                    onError={(e) => {
                        console.error('Error loading image. Original URL:', imageUrl, 'Error:', e);
                        const target = e.target as HTMLImageElement;
                        console.log('Setting fallback image');
                        target.src = 'https://placehold.co/400x600.png?text=Imagen+no+disponible';
                    }}
                />
            </div>
        </div>
    </div>
  ) 
}
export default WatchCover;