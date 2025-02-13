
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { productColors } from "./config/productColorsConfig";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProductColorSelectorProps {
  selectedCategory: string;
  selectedSide: string;
  onColorSelect: (imageUrl: string) => void;
}

const ProductColorSelector = ({
  selectedCategory,
  selectedSide,
  onColorSelect,
}: ProductColorSelectorProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(() => {
    return localStorage.getItem('selectedProductColor') || "#000000";
  });

  // Get available colors for the current product
  const productColor = productColors.find(p => p.productId === selectedCategory);
  const availableColors = [...new Set(productColor?.colors.map(c => c.color) || [])];

  useEffect(() => {
    // When component mounts or selectedCategory changes, set the initial color
    const savedColor = localStorage.getItem('selectedProductColor');
    if (!savedColor && availableColors.length > 0) {
      handleColorSelect(availableColors[0]);
    } else if (savedColor) {
      handleColorSelect(savedColor);
    }
  }, [selectedCategory]);

  const handleColorSelect = (color: string) => {
    const colorVariant = productColor?.colors.find(
      c => c.color === color && c.sideId === selectedSide
    );

    if (colorVariant) {
      setSelectedColor(color);
      localStorage.setItem('selectedProductColor', color);
      onColorSelect(colorVariant.imageUrl);
      console.log('Setting color in localStorage:', color);
      toast.success(`Couleur ${color === '#000000' ? 'noire' : color === '#ffffff' ? 'blanche' : color} sélectionnée`);
    } else {
      toast.error("Cette couleur n'est pas disponible pour ce côté du produit");
    }
  };

  if (!productColor || availableColors.length === 0) {
    return null;
  }

  return (
    <Card className="p-4">
      <Label className="text-sm font-medium mb-2 block">Couleur du produit</Label>
      <div className="flex flex-wrap gap-2">
        {availableColors.map((color) => (
          <button
            key={color}
            onClick={() => handleColorSelect(color)}
            className={cn(
              "w-8 h-8 rounded-full border-2 transition-all duration-200 ring-1 ring-gray-200",
              selectedColor === color ? "border-primary scale-110" : "border-transparent hover:scale-105"
            )}
            style={{ backgroundColor: color }}
            title={color === '#000000' ? 'Noir' : color === '#ffffff' ? 'Blanc' : color}
          />
        ))}
      </div>
    </Card>
  );
};

export default ProductColorSelector;

