
import { ProductConfig } from "@/config/products";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface MinimizedProductCarouselProps {
  products: ProductConfig[];
  selectedProduct: string | null;
  onProductSelect: (productId: string) => void;
}

const MinimizedProductCarousel = ({
  products,
  selectedProduct,
  onProductSelect,
}: MinimizedProductCarouselProps) => {
  return (
    <div className="w-full py-4">
      <div className="max-w-4xl mx-auto px-16 relative">
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/4">
                <div
                  onClick={() => onProductSelect(product.id)}
                  className={cn(
                    "cursor-pointer rounded-lg overflow-hidden border transition-all duration-300 h-[190px]", // Fixed height for consistency
                    selectedProduct === product.id
                      ? "border-primary shadow-lg"
                      : "border-gray-200 hover:border-primary/50"
                  )}
                >
                  <div className="h-[120px] w-full flex items-center justify-center p-2">
                    <img
                      src={product.image || "https://placehold.co/800x800"}
                      alt={product.name}
                      className="max-h-full max-w-full h-auto w-auto object-contain"
                    />
                  </div>
                  <div className="p-3">
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-xs text-primary mt-1">
                      À partir de {product.startingPrice} TND
                    </p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute -left-8 top-1/2 transform -translate-y-1/2" />
          <CarouselNext className="absolute -right-8 top-1/2 transform -translate-y-1/2" />
        </Carousel>
      </div>
    </div>
  );
};

export default MinimizedProductCarousel;
