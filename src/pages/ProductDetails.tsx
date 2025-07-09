
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, ShoppingBag, Heart, Minus, Plus, Truck, Shield } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeartButton from '@/components/HeartButton';
import SizeGuideModal from '@/components/SizeGuideModal';
import { useCurrency } from '@/context/CurrencyContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById } = useProducts();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  const product = getProductById(id!);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-medium text-gray-900 mb-4">
            Produit non trouvé
          </h2>
          <button
            onClick={() => navigate('/')}
            className="text-blue-600 hover:text-blue-800"
          >
            Retour à l'accueil
          </button>
        </div>
        <Footer />
      </div>
    );
  }

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
      id: `${product.id}-${selectedSize}-${product.colors[0]}`,
      name: product.name,
      price: product.price,
      image: product.image,
      size: selectedSize,
      color: product.colors[0],
      quantity: quantity,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} (${quantity}) a été ajouté à votre panier`,
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft size={16} />
            Retour
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
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
                  className={`w-20 h-24 bg-gray-100 rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImageIndex === index ? 'border-black' : 'border-transparent hover:border-gray-300'
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

          {/* Product Details */}
          <div className="space-y-8">
            {/* Category breadcrumb */}
            <div className="text-sm text-gray-500 uppercase tracking-wide">
              {product.category.split('/').join(' / ')}
            </div>

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
              <h1 className="text-3xl font-light text-gray-900 mb-4 font-playfair">
                {product.name}
              </h1>
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-2">
                    {product.rating} ({product.reviews} avis)
                  </span>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center gap-4">
              <span className="text-3xl font-light text-gray-900">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Stock info - moved above size selection */}
            <div className="text-sm">
              {product.stock > 0 ? (
                <span className="text-green-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  En stock ({product.stock} disponible{product.stock > 1 ? 's' : ''})
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Rupture de stock
                </span>
              )}
            </div>

            {/* Size selection */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
                  TAILLE {selectedSize && `- ${selectedSize}`}
                </h3>
                <button 
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 underline"
                >
                  Guide des tailles
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-3 px-2 text-sm font-medium border rounded-lg transition-colors ${
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
              <h3 className="text-sm font-medium text-gray-900 mb-4 uppercase tracking-wide">QUANTITÉ</h3>
              <div className="flex items-center border border-gray-300 rounded-lg w-fit">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus size={16} />
                </button>
                <span className="px-6 py-3 text-sm font-medium">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full bg-black text-white py-4 px-8 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg"
              >
                <ShoppingBag size={20} />
                AJOUTER AU PANIER
              </button>
              
              <div className="flex items-center w-full border border-gray-300 py-4 px-8 rounded-lg hover:bg-gray-50 transition-colors">
                <HeartButton 
                  product={{
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    category: product.category
                  }}
                  size="md"
                />
                <span className="ml-3 text-sm font-medium flex-1 text-center">Ajouter aux favoris</span>
              </div>
            </div>

            {/* Delivery and payment info */}
            <div className="border-t border-gray-200 pt-8 space-y-4">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck size={16} className="text-gray-400" />
                <span>Livraison gratuite dès 150 TND</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Shield size={16} className="text-gray-400" />
                <span>Paiement sécurisé garanti</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
      
      {/* Size Guide Modal */}
      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
      />
    </div>
  );
};

export default ProductDetails;
