import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SizeOption {
  value: string;
  label: string;
  description: string;
}

interface CustomizationOptionsProps {
  selectedSize: string;
  setSelectedSize: (size: string) => void;
  quantity: number;
  handleQuantityChange: (value: number) => void;
  sizeOptions: SizeOption[];
}

interface SizeQuantity {
  size: string;
  quantity: number;
}

const CustomizationOptions = ({
  selectedSize,
  setSelectedSize,
  quantity,
  handleQuantityChange,
  sizeOptions,
}: CustomizationOptionsProps) => {
  const [sizeQuantities, setSizeQuantities] = useState<SizeQuantity[]>([]);
  const [totalQuantity, setTotalQuantity] = useState(0);

  useEffect(() => {
    setTotalQuantity(sizeQuantities.reduce((acc, curr) => acc + curr.quantity, 0));
  }, [sizeQuantities]);

  const handleAddCurrentSelection = () => {
    setSizeQuantities(prev => {
      const existingIndex = prev.findIndex(sq => sq.size === selectedSize);
      if (existingIndex >= 0) {
        const newQuantities = [...prev];
        newQuantities[existingIndex].quantity += quantity;
        return newQuantities;
      }
      return [...prev, { size: selectedSize, quantity }];
    });
    handleQuantityChange(1); // Reset quantity input after adding
  };

  const handleRemoveSizeQuantity = (size: string) => {
    setSizeQuantities(prev => prev.filter(sq => sq.size !== size));
  };

  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="text-xl">Options de personnalisation</CardTitle>
        <CardDescription>
          Sélectionnez la taille et la quantité souhaitées
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block text-left">
              Taille
            </label>
            <Select
              value={selectedSize}
              onValueChange={setSelectedSize}
            >
              <SelectTrigger className="w-full bg-white border-gray-200 hover:border-primary/50 transition-colors">
                <SelectValue placeholder="Sélectionnez une taille" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200">
                {sizeOptions.map((size) => (
                  <SelectItem
                    key={size.value}
                    value={size.value}
                    className="cursor-pointer hover:bg-primary/5"
                  >
                    <div className="space-y-1 text-left">
                      <div className="font-medium">{size.label}</div>
                      <div className="text-xs text-gray-500">
                        {size.description}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block text-left">
              Quantité
            </label>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
                className="h-10 w-10 bg-white border-gray-200 hover:bg-primary/5 hover:border-primary/50"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                min={1}
                max={999}
                className="w-20 text-center bg-white border-gray-200"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 999}
                className="h-10 w-10 bg-white border-gray-200 hover:bg-primary/5 hover:border-primary/50"
              >
                <Plus className="h-4 w-4" />
              </Button>
              <Button
                onClick={handleAddCurrentSelection}
                className="ml-2 bg-primary hover:bg-primary/90"
              >
                Ajouter
              </Button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {sizeQuantities.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="border-t pt-4 mt-4"
            >
              <div className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Récapitulatif des quantités ({totalQuantity} au total)
              </div>
              <div className="space-y-2">
                {sizeQuantities.map((sq) => (
                  <motion.div
                    key={sq.size}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{sq.size}</span>
                      <span className="text-gray-500">×</span>
                      <span className="text-primary font-medium">{sq.quantity}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveSizeQuantity(sq.size)}
                      className="hover:bg-red-50 hover:text-red-600"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default CustomizationOptions;