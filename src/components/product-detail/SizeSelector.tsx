import React from 'react';
import { cn } from "@/lib/utils";

interface SizeSelectorProps {
  selectedSize: string;
  sizes: string[];
  onSizeSelect: (size: string) => void;
}

const SizeSelector = ({ selectedSize, sizes, onSizeSelect }: SizeSelectorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-900">
          Taille {selectedSize ? `sélectionnée: ${selectedSize}` : ''}
        </span>
        <button className="text-xs text-[#700100] hover:underline">
          Guide des tailles
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {sizes.map((size) => (
          <button
            key={size}
            onClick={() => onSizeSelect(size)}
            className={cn(
              "py-2 text-sm font-medium rounded-md transition-all duration-200",
              selectedSize === size 
                ? 'bg-[#700100] text-white shadow-md transform scale-105' 
                : 'bg-white border border-gray-200 text-gray-900 hover:border-[#700100] hover:bg-gray-50'
            )}
          >
            {size}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;