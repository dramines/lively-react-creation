import React, { useState } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, X, Star, Store, ArrowRight, Info } from 'lucide-react';
import { useCart } from './cart/CartProvider';
import { useToast } from "@/hooks/use-toast";
import { playTickSound } from '../utils/audio';
import { motion } from 'framer-motion';
import ColorSelector from './product-detail/ColorSelector';
import SizeSelector from './product-detail/SizeSelector';
import QuantitySelector from './product-detail/QuantitySelector';
import PersonalizationButton from './product-detail/PersonalizationButton';
import { getPersonalizations } from '@/utils/personalizationStorage';

interface ProductDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    id: number;
    name: string;
    material: string;
    color: string;
    price: number;
    image: string;
    description: string;
    status: string;
  };
}

const ProductDetailModal = ({ isOpen, onClose, product }: ProductDetailModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [personalization, setPersonalization] = useState(() => {
    const savedPersonalizations = getPersonalizations();
    return savedPersonalizations[product.id] || '';
  });
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Veuillez sélectionner une taille",
        description: "Une taille doit être sélectionnée avant d'ajouter au panier",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: quantity,
      size: selectedSize,
      color: product.color,
      personalization: personalization
    });

    playTickSound();
    toast({
      title: "Produit ajouté au panier",
      description: `${quantity} x ${product.name} (${selectedSize}) ajouté avec succès`,
      duration: 5000,
      style: {
        backgroundColor: '#700100',
        color: 'white',
        border: '1px solid #590000',
      },
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[1000px] p-0 bg-white rounded-lg shadow-xl overflow-hidden mx-auto">
        <div className="flex flex-col lg:flex-row h-[90vh] lg:h-auto">
          {/* Left Column - Image */}
          <div className="w-full lg:w-1/2 relative bg-gray-50 p-4">
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className="absolute right-4 top-4 p-2 rounded-full bg-white shadow-md hover:bg-gray-50 transition-colors z-10"
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-[#700100] text-[#700100]' : 'text-gray-400'}`} />
            </button>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Right Column - Product Info */}
          <div className="w-full lg:w-1/2 p-4 lg:p-6 overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>

            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 font-['WomanFontBold']">{product.name}</h2>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-2xl font-bold text-[#700100]">{product.price} TND</span>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`}
                      />
                    ))}
                    <span className="text-sm text-gray-600 ml-2">(118)</span>
                  </div>
                </div>
              </div>
{/* 
              <ColorSelector
                selectedColor={product.color}
                colors={{
                  "Orange": "#DC6B48",
                  "White": "#FFFFFF",
                  "Gray": "#E5E5E5",
                  "Black": "#1A1A1A",
                  "Brown": "#8B4513",
                  "Sage": "#9CA88C"
                }}
                onColorSelect={(color) => console.log('Selected color:', color)}
              /> */}

              <SizeSelector
                selectedSize={selectedSize}
                sizes={['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL']}
                onSizeSelect={setSelectedSize}
              />

              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-900">Quantité</span>
                <QuantitySelector
                  quantity={quantity}
                  onIncrement={() => setQuantity(q => q + 1)}
                  onDecrement={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                />
              </div>

              <PersonalizationButton
                productId={product.id}
                onSave={setPersonalization}
                initialText={personalization}
              />

              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  className="w-full bg-[#700100] hover:bg-[#590000] text-white py-6 rounded-lg flex items-center justify-center gap-2 transition-all duration-300"
                  disabled={product.status !== 'En stock'}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span className="font-medium">
                    {product.status === 'En stock' ? 'Ajouter au panier' : 'Produit épuisé'}
                  </span>
                </Button>

                <button className="w-full py-2.5 border border-[#700100] text-[#700100] rounded-lg flex items-center justify-center gap-2 hover:bg-[#700100] hover:text-white transition-all duration-300">
                  <Store className="h-5 w-5" />
                  Vérifier la disponibilité en magasin
                </button>
              </div>

              <div className="space-y-3 bg-gray-50 p-3 rounded-lg text-sm">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-[#700100] mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">Matière</h4>
                    <p className="text-gray-600">{product.material}</p>
                  </div>
                </div>
                <div className="space-y-2 text-gray-600">
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#700100]" />
                    Livraison gratuite en Tunisie
                  </div>
                  <div className="flex items-center gap-2">
                    <ArrowRight className="h-4 w-4 text-[#700100]" />
                    Retours gratuits sous 14 jours
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;