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
    <li className="relative group w-56 lg:w-64 flex flex-col items-center">
      <Link href={`/watch/${id}`}>
        <div className="relative w-full">
          <WatchCover coverColor={colorTheme} coverImage={imageUrl} className="relative z-0" />

          <div className="absolute left-2/3 bottom-1 transform -translate-x-1/ hidden lg:flex flex-col items-center justify-center bg-black bg-opacity-90 backdrop-blur-md rounded-xl px-12 py-2 shadow-md z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <span className="font-semibold text-lg text-light-100">{name}</span>
            <span className="text-sm text-light-200">${price}</span>
          </div>
        </div>
      </Link>

      <div className="flex flex-col items-center mt-2 lg:hidden text-center">
        <span className="font-semibold text-light-100">{name}</span>
        <span className="text-light-200">${price}</span>
      </div>
    </li>
  );
};

export default WatchCard;
