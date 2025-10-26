import Link from 'next/link';
import React from 'react';
import WatchCover from './WatchCover';

const WatchCard = ({
  id,
  name,
  price,
  colorTheme,
  imageUrl,
}: Watch) => {
  return (
    <div className="relative group w-full max-w-[280px] mx-auto">
      <Link href={`/watch/${id}`} className="block w-full">
        <div className="relative w-full aspect-square">
          <WatchCover 
            coverColor={colorTheme} 
            coverImage={imageUrl} 
            className="w-full h-full object-cover rounded-lg"
          />

          {/* Hover effect for desktop */}
          <div className="absolute inset-0 hidden lg:flex flex-col items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-90 transition-all duration-300 rounded-lg">
            <div className="opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 text-center p-4">
              <span className="font-semibold text-lg text-light-100 block">{name}</span>
              <span className="text-light-200">${price}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Always visible info on mobile */}
      <div className="lg:hidden text-center mt-3 px-2">
        <span className="font-semibold text-light-100 block">{name}</span>
        <span className="text-light-200">${price}</span>
      </div>
    </div>
  );
};

export default WatchCard;
