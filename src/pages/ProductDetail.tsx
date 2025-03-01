
import { useState } from 'react';
import { Minus, Plus, ShoppingBag, Heart, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/use-toast';
import { getProductImages } from '@/config/productDetailImages';
import { products } from '@/config/products';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useCartStore } from '@/components/cart/CartProvider';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState("Blanc");
  const [showDialog, setShowDialog] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const addToCart = useCartStore((state) => state.addItem);

  const productImages = getProductImages(id || '');
  const product = products.find(p => p.id === id);

  const availableColors = [
    { name: "Blanc", value: "#FFFFFF", border: "border-gray-200" },
    { name: "Noir", value: "#000000" },
    { name: "Bleu Marine", value: "#1B2C4B" },
    { name: "Rouge", value: "#DC2626" },
  ];

  if (!product) {
    return <div>Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Erreur",
        description: "Veuillez sélectionner une taille",
        variant: "destructive",
      });
      return;
    }

    const numericId = parseInt(id?.replace(/[^0-9]/g, '') || '') || Date.now();

    addToCart({
      id: `${id}-${selectedSize}-${selectedColor}`,
      quantity,
      product_id: numericId,
      size: selectedSize,
      color: selectedColor,
      itemgroup_product: product.name,
    });

    toast({
      title: "✨ Produit ajouté !",
      description: `${product.name} (Taille: ${selectedSize}, Couleur: ${selectedColor}, Quantité: ${quantity})`,
      className: "bg-primary text-white",
    });

    setShowDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <Button 
        variant="ghost" 
        className="mb-4 hover:bg-gray-100" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour
      </Button>

      <div className="flex flex-col lg:flex-row gap-6 bg-white rounded-xl p-6 shadow-sm">
        {/* Left side - Product Images */}
        <div className="lg:w-20 flex lg:flex-col gap-3 order-2 lg:order-1">
          {productImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square overflow-hidden rounded-lg border-2 transition-all duration-300 ${
                selectedImage === index ? 'border-primary' : 'border-gray-200'
              }`}
            >
              <img
                src={image}
                alt={`Product view ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>

        <div className="lg:flex-1 order-1 lg:order-2 relative">
          {/* Company Logo Overlay */}
          <div className="absolute top-4 left-4 z-10 bg-white rounded-lg p-1 shadow-md">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-8 h-8 object-contain"
            />
          </div>

          <button 
            onClick={() => setShowImageModal(true)}
            className="aspect-square rounded-lg overflow-hidden bg-gray-50 w-full relative group cursor-zoom-in"
          >
            <img
              src={productImages[selectedImage]}
              alt="Product main view"
              className="h-full w-full object-contain transition-all duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8" />
            </div>
          </button>
        </div>

        <div className="lg:w-1/3 space-y-6 order-3">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-3">
              {product.name}
            </h1>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-gray-500 uppercase">Prix à partir de</p>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-red-600">{product.startingPrice} TND</span>
              <span className="text-gray-500 line-through text-lg">
                {(parseFloat(product.startingPrice) * 1.3).toFixed(2)} TND
              </span>
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">Couleur disponible</label>
            <div className="flex gap-3">
              {availableColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    color.border || 'border-transparent'
                  } ${selectedColor === color.name ? 'ring-2 ring-primary ring-offset-2' : ''} 
                    transition-all duration-300 hover:scale-110 focus:outline-none`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              Taille
            </label>
            <select 
              className="w-full border rounded-md p-2 bg-white focus:ring-2 focus:ring-primary focus:border-primary"
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
            >
              <option value="">Sélectionnez une taille</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
              <option value="XXL">XXL</option>
            </select>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-lg border">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-16 text-center border rounded-lg p-2"
              min="1"
            />
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 border rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3 pt-2">
            {product.isPersonalizable ? (
              <Link 
                to="/personalization" 
                className="w-full bg-secondary text-primary px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-secondary/90 transition-colors font-medium"
              >
                <ShoppingBag className="w-5 h-5" />
                Personnaliser
              </Link>
            ) : null}
            
            <button
              onClick={handleAddToCart}
              disabled={!selectedSize}
              className={`w-full px-6 py-3 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 transform hover:scale-102 font-medium ${
                selectedSize 
                  ? 'bg-primary text-white hover:bg-primary/90' 
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              Commander maintenant
            </button>
          </div>

          <button className="flex items-center gap-2 text-gray-600 hover:text-primary text-sm w-full mt-4">
            <Heart className="w-4 h-4" />
            Ajouter à ma liste d'envie
          </button>
        </div>
      </div>

      {/* Add to Cart Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Produit ajouté au panier</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={() => setShowDialog(false)}
              className="sm:flex-1"
            >
              Continuer mes achats
            </Button>
            <Button
              onClick={() => navigate('/cart')}
              className="sm:flex-1"
            >
              Voir mon panier
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Image Modal */}
      <Dialog open={showImageModal} onOpenChange={setShowImageModal}>
        <DialogContent className="sm:max-w-4xl h-[90vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle>Vue détaillée</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden relative bg-white p-4">
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <img
                src={productImages[selectedImage]}
                alt={product.name}
                className="max-w-full max-h-full transition-transform duration-200"
                style={{ transform: `scale(${zoomLevel})` }}
              />
            </div>
            <div className="absolute bottom-6 right-6 flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.5, 1))}
                disabled={zoomLevel <= 1}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.5, 3))}
                disabled={zoomLevel >= 3}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
