import React from "react";
import WatchCard from "./WatchCard";

interface WatchListProps {
    name: string;
    watches: Watch[];
    containerClassName?: string;
}

const WatchList = ({name, watches, containerClassName}: WatchListProps) => {
   return <section className={containerClassName}>
   <h2 className="font-bebas-neue text-4xl text-light-100 mb-4">{name}</h2>
   
   <ul className="watch-list grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {watches.map((watch)=>(
          <WatchCard key={watch.name}{...watch}/>
      ))}
        
   
    </ul>
   </section>
};

export default WatchList;
