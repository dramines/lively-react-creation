
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { products } from "@/config/products";
import { productSideImages } from "./config/productSideImagesConfig";
import { ArrowLeftRight } from "lucide-react";
import { productColors } from "./config/productColorsConfig";

interface ProductSideSelectorProps {
  sides: ProductSide[];
  activeSide: string;
  onSideSelect: (sideId: string) => void;
  selectedCategory: string;
}

interface ProductSide {
  id: string;
  title: string;
  description?: string;
}

const ProductSideSelector = ({ 
  sides, 
  activeSide, 
  onSideSelect,
  selectedCategory 
}: ProductSideSelectorProps) => {
  if (sides.length <= 1) return null;

  // Get the current color's images
  const productColor = productColors.find(p => p.productId === selectedCategory);
  const currentSideImages = productColor?.colors.reduce((acc, color) => {
    if (color.color === "#000000") { // Default to black if no color is selected
      acc[color.sideId] = color.imageUrl;
    }
    return acc;
  }, {} as Record<string, string>);

  return (
    <Card className="p-4 bg-white shadow-lg mb-4 border-none rounded-xl">
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center justify-center w-full gap-6">
          {sides.map((side) => {
            const sideImage = currentSideImages?.[side.id];
            const isActive = activeSide === side.id;
            
            return (
              <div 
                key={side.id} 
                className="flex-1 max-w-[110px]" // Reduced from 122px by ~10%
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => onSideSelect(side.id)}
                        className={`group w-full transition-all duration-300 ${
                          isActive 
                            ? "scale-105" 
                            : "hover:scale-102"
                        }`}
                      >
                        <div className={`relative overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                          isActive 
                            ? "border-primary shadow-lg" 
                            : "border-gray-200 hover:border-primary/50"
                        }`}>
                          <div className="aspect-square w-full bg-gray-50">
                            {sideImage ? (
                              <img
                                src={sideImage}
                                alt={side.title}
                                className="w-full h-full object-contain p-3"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-gray-400">No preview</span>
                              </div>
                            )}
                          </div>
                          <div className={`absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 ${
                            isActive 
                              ? "bg-black/0" 
                              : "group-hover:bg-black/5"
                          }`}>
                            {!isActive && (
                              <Button
                                variant="secondary"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                              >
                                Sélectionner
                              </Button>
                            )}
                          </div>
                        </div>
                        <div className={`mt-2 text-center text-sm transition-colors duration-300 ${
                          isActive ? "text-primary font-medium" : "text-gray-600"
                        }`}>
                          {side.title}
                        </div>
                      </button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{side.description || `Personnaliser ${side.title.toLowerCase()}`}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <ArrowLeftRight className="h-3 w-3" />
          <span>Cliquez pour basculer entre les côtés</span>
        </div>
      </div>
    </Card>
  );
};

export default ProductSideSelector;

