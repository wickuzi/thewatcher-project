import React from "react";
import WatchCard from "./WatchCard";

interface WatchListProps {
    name: string;
    watches: Watch[];
    containerClassName?: string;
}

const WatchList = ({name, watches, containerClassName}: WatchListProps) => {
   return (
     <section className={`w-full max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 ${containerClassName || ''}`}>
       <h2 className="font-bebas-neue text-4xl text-light-100 mb-6 text-center md:text-left">{name}</h2>
       
       <div className="w-full flex justify-center">
         <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl">
           {watches.map((watch) => (
             <li key={watch.id} className="flex justify-center w-full">
               <WatchCard {...watch} />
             </li>
           ))}
         </ul>
       </div>
     </section>
   );
};

export default WatchList;
