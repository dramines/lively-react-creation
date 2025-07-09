
import React, { useState } from 'react';
import { X, Star, ShoppingBag, Heart, Minus, Plus } from 'lucide-react';
import { Product } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';

interface ProductModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, isOpen, onClose }) => {
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Taille requise",
        description: "Veuillez sélectionner une taille",
        variant: "destructive",
      });
      return;
    }

    addToCart({
      id: `${product.id}-${selectedSize}-${selectedColor}`,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} (${quantity}) a été ajouté à votre panier`,
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-white rounded-full shadow-md hover:bg-gray-50"
          >
            <X size={20} />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            {/* Image section */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Image thumbnails */}
              <div className="flex gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-16 h-20 bg-gray-100 rounded-lg overflow-hidden border-2 ${
                      selectedImageIndex === index ? 'border-black' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product details */}
            <div className="space-y-6">
              {/* Product badges */}
              <div className="flex gap-2">
                {product.isNew && (
                  <span className="bg-black text-white px-3 py-1 text-sm font-medium rounded">
                    NOUVEAU
                  </span>
                )}
                {product.isOnSale && (
                  <span className="bg-red-500 text-white px-3 py-1 text-sm font-medium rounded">
                    SOLDE
                  </span>
                )}
              </div>

              {/* Title and rating */}
              <div>
                <h1 className="text-2xl font-medium text-gray-900 mb-2">
                  {product.name}
                </h1>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm text-gray-600 ml-1">
                      {product.rating} ({product.reviews} avis)
                    </span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-2xl font-medium text-gray-900">
                  {product.price}€
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {product.originalPrice}€
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>

              {/* Color selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Couleur: {selectedColor}
                </h3>
                <div className="flex gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color ? 'border-black' : 'border-gray-300'
                      }`}
                      style={{ 
                        backgroundColor: color.toLowerCase() === 'blanc' ? '#fff' : 
                                        color.toLowerCase() === 'noir' ? '#000' :
                                        color.toLowerCase() === 'rouge' ? '#ef4444' :
                                        color.toLowerCase() === 'bleu' ? '#3b82f6' :
                                        color.toLowerCase() === 'vert' ? '#22c55e' :
                                        color.toLowerCase() === 'rose' ? '#ec4899' :
                                        color.toLowerCase() === 'gris' ? '#6b7280' :
                                        color.toLowerCase() === 'beige' ? '#d2b48c' :
                                        '#9ca3af'
                      }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                  Taille {selectedSize && `- ${selectedSize}`}
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-sm font-medium border rounded-lg transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-3">Quantité</h3>
                <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 text-sm font-medium">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Stock info */}
              <div className="text-sm text-gray-600">
                {product.stock > 0 ? (
                  <span className="text-green-600">
                    En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                  </span>
                ) : (
                  <span className="text-red-600">Rupture de stock</span>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="flex-1 bg-black text-white py-3 px-6 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <ShoppingBag size={20} />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
