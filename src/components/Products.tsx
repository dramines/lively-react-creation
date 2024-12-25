import React from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel";
import useEmblaCarousel from 'embla-carousel-react';
import ProductCard from './ProductCard';
import Categories from './Categories';
import { useQuery } from '@tanstack/react-query';
import { fetchAllProducts } from '../services/productsApi';
import { Skeleton } from './ui/skeleton';
import 'bootstrap-icons/font/bootstrap-icons.css';

const Products = () => {
  const [emblaRef] = useEmblaCarousel({
    loop: true,
    align: 'start',
    skipSnaps: false,
    dragFree: false,
    containScroll: 'trimSnaps'
  });

  const { data: products, isLoading, error } = useQuery({
    queryKey: ['products'],
    queryFn: fetchAllProducts,
  });

  if (error) {
    console.error('Erreur de chargement des produits:', error);
    return <div className="text-center text-red-500">Échec du chargement des produits</div>;
  }

  return (
    <div className="w-full overflow-hidden bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-3xl lg:text-4xl text-center text-[#700100] font-['WomanFontBold'] mb-8">
          Nouveau produits
        </h1>
        <Categories />
        <div className="relative w-full" ref={emblaRef}>
          <Carousel className="w-full">
            <CarouselContent className="-ml-4">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <CarouselItem 
                    key={index} 
                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/4"
                  >
                    <div className="h-[400px] bg-gray-100 rounded-lg animate-pulse" />
                  </CarouselItem>
                ))
              ) : (
                products?.map((product) => (
                  <CarouselItem 
                    key={product.id} 
                    className="pl-4 basis-full md:basis-1/2 lg:basis-1/4"
                  >
                    <ProductCard product={product} />
                  </CarouselItem>
                ))
              )}
            </CarouselContent>
            <CarouselPrevious
              aria-label="Previous product"
              className="absolute -left-2 md:-left-6 top-1/2 transform -translate-y-1/2 bg-[#700100] hover:bg-black/90 border-none h-8 w-8 md:h-10 md:w-10 rounded-full z-10"
            >
              <i className="bi bi-chevron-left text-white"></i>
            </CarouselPrevious>
            <CarouselNext
              aria-label="Next product"
              className="absolute -right-2 md:-right-6 top-1/2 transform -translate-y-1/2 bg-[#700100] hover:bg-black/90 border-none h-8 w-8 md:h-10 md:w-10 rounded-full z-10"
            >
              <i className="bi bi-chevron-right text-white"></i>
            </CarouselNext>
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default Products;
