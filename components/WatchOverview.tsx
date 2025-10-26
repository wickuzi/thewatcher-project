import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import WatchCover from "./WatchCover";

interface Watch {
  name: string;
  brand: string;
  category: string;
  rating: number;
  price: number;
  availableStock: number;
  description: string;
  colorTheme: string;
  imageUrl: string;
  summary: string;
  videoUrl: string;
}

const WatchOverview = ({ name, brand, category, rating, price, availableStock, description, colorTheme, imageUrl, summary, videoUrl }: Watch) => {
    return (
     
      <section className="watch-overview"> 
          
          {}
          <div className="flex flex-1 flex-col"> 
              <h1 className="watch-title font-bebas-neue text-4xl text-light-100">{name}</h1>

              <div className="watch-info">
                  <p>
                      <span className="font-semibold text-light-100">{brand} </span>
                  </p>
                  <p>
                      Categoria{": "}
                      <span className="font-semibold text-light-200">{category}</span>
                  </p>
                  <div className="flex flex-row gap-1">
                      <Image src="/icons/star.svg" alt="star" width={22} height={22}/>
                      <p>{rating}</p>
                  </div>
              </div>
              <p className="watch-price">
                  <span className="font-semibold text-light-300">Precio: </span>
                  <span className="font-semibold text-light-200">${price}</span>
              </p>
              <div className="watch-copies">
                  <p>Disponibles: <span className="font-semibold text-light-300">{availableStock}</span></p>
              </div>
              <p className="watch-description">{description}</p>
              
              <Button className="watch-overview_btn">
                  <Image src="/icons/watch.svg" alt="watch" width={20} height={20}/>
                  <p className="font-bebas-neue text-xl text-dark-100">Comprar Ahora</p>
              </Button>
          </div>

          {/* Columna de Imágenes (Aparecerá ARRIBA en móvil) */}
          <div className="relative flex flex-1 justify-center">
              {/* Contenedor con tamaño fijo para que WatchCover funcione correctamente */}
              <div className="relative">
                  <WatchCover
                      variant="wide"
                      className="z-10"
                      coverColor={colorTheme}
                      coverImage={imageUrl}
                  />

                  {/* Segunda copia (sombra/fondo) */}
                  <div className="absolute left-16 top-10 rotate-12 opacity-40 max-sm:hidden">
                      <WatchCover
                          variant="wide"
                          coverColor={colorTheme}
                          coverImage={imageUrl}
                      />
                  </div>
              </div>
          </div>
      </section>
    );
};

export default WatchOverview;