
"use client"
import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { WishlistButton } from "./WishlistButton";
import WatchCover from "./WatchCover";
import { Watch } from "@/types";
import { FaWhatsapp } from "react-icons/fa";
import { formatCurrency } from "@/lib/currency";



interface WatchOverviewProps extends Omit<Watch, 'createdAt'> {
  // Mostrar el botón de añadir a la lista de deseos
  showWishlistButton?: boolean;
  // Otras propiedades adicionales si son necesarias
}

const WatchOverview = ({ 
  id,
  name, 
  brand, 
  category, 
  rating, 
  price, 
  availableStock, 
  description, 
  imageUrl, 
  videoUrl = '',
  summary = description, // Usamos description como valor por defecto para summary
  showWishlistButton = false // Por defecto no mostrar el botón
}: WatchOverviewProps) => {
    return (
     
      <section className="watch-overview"> 
          
          {}
          <div className="flex flex-2 flex-col mr-50"> 
              <h1 className="watch-title font-bebas-neue text-xl text-light-100">{name}</h1>

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
                  <span className="font-semibold text-light-200">C$ {price.toLocaleString('es-NI')}</span>
              </p>
              <div className="watch-copies">
                  <p>Disponibles: <span className="font-semibold text-light-300">{availableStock}</span></p>
              </div>
              <p className="watch-description">{description}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button 
                  className="watch-overview_btn flex-1 bg-green-500 hover:bg-green-600 text-white"
                  onClick={(e) => {
                    e.preventDefault();
                    const phoneNumber = '50558655140';
                    const message = `Hola, estoy interesado en comprar el siguiente reloj:

*${name}*
Marca: ${brand}
Precio: C$ ${price.toLocaleString('es-NI')}`;
                    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
                    window.open(whatsappUrl, '_blank');
                  }}
                >
                  <FaWhatsapp className="text-lg" />
                  <p className="font-bebas-neue text-lg text-dark-100 ml-2">Comprar Ahora</p>
                </Button>
                {showWishlistButton && (
                  <WishlistButton 
                    watch={{
                      id,
                      name,
                      brand,
                      category,
                      rating,
                      price,
                      cost:0,
                      availableStock,
                      description,
                      imageUrl,
                      videoUrl,
                      summary: summary || description,
                      createdAt: new Date()
                    }} 
                    className="flex-1"
                  />
                )}
              </div>
          </div>

          {/* Columna de Imágenes (Aparecerá ARRIBA en móvil) */}
          <div className="relative flex flex-1 justify-center">
              {/* Contenedor con tamaño fijo para que WatchCover funcione correctamente */}
              <div className="relative">
                  <WatchCover
                      variant="wide"
                      className="z-10"
                      imageUrl={imageUrl}
                  />

                  {/* Efecto de fondo más sutil */}
                  <div className="absolute left-10 top-6 rotate-6 opacity-20 max-sm:hidden">
                      <WatchCover
                          variant="wide"
                          imageUrl={imageUrl}
                      />
                  </div>
              </div>
          </div>

         
      </section>
    );
};

export default WatchOverview;