import React from "react";
import WatchCard from "./WatchCard";
import { Watch } from "@/types";

interface WatchListProps {
  name: string;
  watches: Watch[];
  className?: string;
}

const WatchList = ({ name, watches, className = "" }: WatchListProps) => {
  return (
    <section className={`mb-16 ${className}`}>
      <h2 className="font-bebas-neue text-4xl text-light-100 mb-8 text-center">
        {name}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-6 lg:px-8">
        {watches.map((watch) => (
          <WatchCard key={watch.id} {...watch} />
        ))}
      </div>
    </section>
  );
};

export default WatchList;