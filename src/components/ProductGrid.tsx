
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { products } from "@/config/products";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";
import Autoplay from "embla-carousel-autoplay";

interface ProductGridProps {
  onAddToCart: () => void;
  limit?: number;
  hideCategories?: boolean;
}

const ProductGrid = ({ onAddToCart, limit, hideCategories = false }: ProductGridProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const categories = ["all", ...new Set(products.map(product => product.name))];
  
  const filteredProducts = selectedCategory === "all" 
    ? products 
    : products.filter(product => product.name === selectedCategory);

  const displayedProducts = limit 
    ? filteredProducts.slice(0, limit) 
    : filteredProducts;

  const plugin = Autoplay({ delay: 4000, stopOnInteraction: true });

  return (
    <div className="space-y-8">
      {!hideCategories && (
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full transition-colors duration-200 ${
                selectedCategory === category
                  ? "bg-primary text-white"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      )}
      
      <div className="max-w-[95vw] mx-auto relative">
        <div className="relative px-8">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            plugins={[plugin]}
            className="w-full"
          >
            <CarouselContent>
              {displayedProducts.map((product) => (
                <CarouselItem key={product.id} className="md:basis-1/3 lg:basis-1/3">
                  <div 
                    className="group relative overflow-hidden rounded-lg bg-white shadow-md transition-all duration-300 hover:shadow-xl h-full mx-2"
                  >
                    <div className="aspect-square overflow-hidden bg-gray-50 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <img
                          src={product.image || "https://placehold.co/800x800"}
                          alt={product.name}
                          className={`w-full h-full object-contain p-4 transition-opacity duration-300 ${
                            product.presentationImage ? 'group-hover:opacity-0' : ''
                          }`}
                        />
                        {product.presentationImage && (
                          <img
                            src={product.presentationImage}
                            alt={`${product.name} presentation`}
                            className="absolute inset-0 w-full h-full object-contain p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          />
                        )}
                      </div>
                    </div>
                    <div className="p-4 space-y-2">
                      <div className="text-xs text-gray-500">{product.name}</div>
                      <h3 className="font-sans text-lg font-medium text-primary">{product.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-semibold text-primary">À partir de {product.startingPrice} TND</p>
                        <button
                          onClick={() => navigate('/personalization')}
                          className="rounded-full bg-primary px-4 py-2 text-sm text-white transition-colors hover:bg-primary/90"
                        >
                          Personnaliser
                        </button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="absolute -left-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white shadow-lg hover:bg-gray-100" />
            <CarouselNext className="absolute -right-4 top-1/2 -translate-y-1/2 z-20 cursor-pointer bg-white shadow-lg hover:bg-gray-100" />
          </Carousel>
        </div>
      </div>
    </div>
  );
};

export default ProductGrid;
