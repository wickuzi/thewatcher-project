import Link from 'next/link';
import React from 'react';
import WatchCover from './WatchCover';
import { Watch } from '@/types';

const WatchCard = ({
  id,
  name,
  brand,
  price,
  imageUrl,
}: Watch) => {
  return (
    <li className="w-40 sm:w-48 md:w-56 lg:w-64 mx-auto">
      <Link href={`/watch/${id}`} className="block">
        <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
          {/* Image */}
          <div className="relative w-full h-full group">
            <WatchCover 
              imageUrl={imageUrl} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            
            {/* Hover Overlay - Hidden on mobile */}
            <div className="hidden lg:absolute lg:inset-0 lg:mt-0.2 lg:mr-5 lg:mb-0.2 lg:ml-5 lg:mb-8 lg:bg-black/70 lg:opacity-0 lg:group-hover:opacity-100 lg:transition-opacity lg:duration-300 lg:flex lg:flex-col lg:justify-center lg:items-center lg:p-4 lg:text-center">
              <h3 className="text-white text-lg font-medium mb-1">{name}</h3>
              <p className="text-light-200 text-sm mb-2">{brand}</p>
              <p className="text-primary font-semibold">${price}</p>
            </div>
          </div>
          
         
        </div>
        
        {/* Mobile info (visible only on mobile) */}
        <div className="lg:hidden">
          <div className="mt-2 px-2">
            <p className="text-light-100 text-sm font-medium mb-0.5 line-clamp-1">{name}</p>
            <p className="text-primary font-bold text-base">${price}</p>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default WatchCard;