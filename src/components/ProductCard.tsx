import React, { useState } from "react";
import { Heart, ShoppingBag, Star } from "lucide-react";
import { Product } from "@/context/ProductContext";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import HeartButton from "@/components/HeartButton";
import { getItemGroupSizeType, getSizeFieldsForItemGroup, getSizeLabelsForItemGroup, needsSizeSelection } from "@/config/productSizeConfig";
import { useCurrency } from "@/context/CurrencyContext";

interface ProductCardProps {
  product: Product & {
    itemgroup_product?: string;
    xs_size?: string;
    s_size?: string;
    m_size?: string;
    l_size?: string;
    xl_size?: string;
    xxl_size?: string;
    '3xl_size'?: string;
    '4xl_size'?: string;
    '48_size'?: string;
    '50_size'?: string;
    '52_size'?: string;
    '54_size'?: string;
    '56_size'?: string;
    '58_size'?: string;
    qnty_product?: string;
  };
  onQuickView?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const { formatPrice } = useCurrency();

  // Get available sizes based on product itemgroup
  const getAvailableSizes = () => {
    // If we don't have itemgroup data, fall back to the original sizes array
    if (!product.itemgroup_product) {
      return product.sizes || [];
    }

    if (!needsSizeSelection(product.itemgroup_product)) {
      return []; // Quantity-only products don't show sizes
    }

    const sizeFields = getSizeFieldsForItemGroup(product.itemgroup_product);
    const sizeLabels = getSizeLabelsForItemGroup(product.itemgroup_product);
    const availableSizes: string[] = [];

    sizeFields.forEach((field, index) => {
      const sizeValue = product[field as keyof typeof product] as string;
      if (sizeValue && parseInt(sizeValue) > 0) {
        availableSizes.push(sizeLabels[index]);
      }
    });

    // If no sizes found from database but we have original sizes, use those
    return availableSizes.length > 0 ? availableSizes : (product.sizes || []);
  };

  const availableSizes = getAvailableSizes();
  const productNeedsSize = !product.itemgroup_product || (product.itemgroup_product && needsSizeSelection(product.itemgroup_product));

  // Debug logging
  console.log('ProductCard Debug:', {
    productName: product.name,
    itemgroup: product.itemgroup_product,
    productNeedsSize,
    availableSizes,
    productSizes: product.sizes,
    sizeFields: product.itemgroup_product ? getSizeFieldsForItemGroup(product.itemgroup_product) : []
  });

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (productNeedsSize && !selectedSize) {
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
      quantity: 1,
    });

    toast({
      title: "Produit ajouté",
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onQuickView?.(product)}
    >
      <div className="relative overflow-hidden my-4 bg-gray-100 aspect-[3/4]">
        {/* Product badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
          {product.isNew && (
            <span className="bg-black text-white px-2 py-1 text-xs font-medium rounded">
              NOUVEAU
            </span>
          )}
          {product.isOnSale && (
            <span className="bg-red-500 text-white px-2 py-1 text-xs font-medium rounded">
              SOLDE
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <HeartButton 
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category
            }}
            className="bg-white rounded-full shadow-md hover:bg-gray-50"
            size="sm"
          />
        </div>

        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Quick add overlay */}
        <div
          className={`absolute inset-0 bg-black bg-opacity-50 flex items-end justify-center p-4 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="w-full space-y-2">
            {/* Size selection - only show if product needs size and has available sizes */}
            {productNeedsSize && availableSizes.length > 0 && (
              <div className="flex flex-wrap gap-1 justify-center">
                {availableSizes.slice(0, 6).map((size) => (
                  <button
                    key={size}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    className={`px-2 py-1 text-xs font-medium rounded transition-colors ${
                      selectedSize === size
                        ? "bg-white text-black"
                        : "bg-gray-200 text-gray-700 hover:bg-white hover:text-black"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-white text-black py-2 px-4 rounded font-medium hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <ShoppingBag size={16} />
              {productNeedsSize ? "Ajouter au panier" : "Ajouter au panier"}
            </button>
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1">
        <h3 className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-900">
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
