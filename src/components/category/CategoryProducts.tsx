import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { getSizeFieldsForItemGroup, SIZE_DISPLAY_NAMES } from '@/data/productCategories';
import { getProductImage } from '@/utils/imageUtils';

interface Product {
  id_product: number;
  nom_product: string;
  price_product: string;
  discount_product?: string;
  img_product: string;
  img2?: string;
  category_product: string;
  itemgroup_product: string;
  status_product: string;
  createdate_product: string;
  quantity_product?: string;
  // Size fields
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
}

interface CategoryProductsProps {
  products: Product[];
  loading: boolean;
  likedProducts: Set<number>;
  onToggleLike: (productId: number) => void;
}

const CategoryProducts = ({ products, loading, likedProducts, onToggleLike }: CategoryProductsProps) => {
  const { t } = useTranslation(['products', 'common']);
  const navigate = useNavigate();

  // Array of placeholder images to use randomly
  const placeholderImages = [
    '/lovable-uploads/b89b1719-64f0-4f92-bbdb-cfb07951073a.png',
    '/lovable-uploads/1e127b10-9a18-47a3-b8df-ff0d939224ba.png',
    '/lovable-uploads/2842003f-8573-41de-8f49-c3331a6aa59b.png'
  ];

  const getImageSrc = (imagePath: string, productId: number) => {
    if (!imagePath || imagePath.includes('placeholder.svg')) {
      // Use a random placeholder image based on product ID
      const randomIndex = productId % placeholderImages.length;
      return placeholderImages[randomIndex];
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('/lovable-uploads/')) {
      return imagePath;
    }
    
    // Construct the full server path
    return `https://draminesaid.com/lucci/uploads/${imagePath}`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="aspect-[3/4] bg-slate-200 mb-4"></div>
            <div className="h-4 bg-slate-200 mb-2"></div>
            <div className="h-4 bg-slate-200 w-2/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-lg text-slate-600 mb-8">
          Aucun produit trouvé dans cette catégorie.
        </p>
        <Button 
          size="lg" 
          variant="outline" 
          className="px-8 py-3 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white"
          onClick={() => window.history.back()}
        >
          Retour
        </Button>
      </div>
    );
  }

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice} TND`;
  };

  const calculateDiscountedPrice = (price: string | number, discount: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;
    return numPrice - (numPrice * numDiscount / 100);
  };

  const getAvailableSizes = (product: Product): string[] => {
    // Get size fields for this item group (formal or standard)
    const sizeFields = getSizeFieldsForItemGroup(product.itemgroup_product || '');
    const availableSizes: string[] = [];
    
    console.log('Product:', product.nom_product, 'Item group:', product.itemgroup_product);
    console.log('Size fields to check:', sizeFields);

    // Check all size fields (both formal and standard) to ensure we catch all available sizes
    const allSizeFields = ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
    
    allSizeFields.forEach(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      console.log(`Checking ${sizeField}:`, sizeValue);
      
      if (sizeValue && parseInt(sizeValue) > 0) {
        const displayName = SIZE_DISPLAY_NAMES[sizeField];
        if (displayName) {
          availableSizes.push(displayName);
          console.log(`Added size: ${displayName}`);
        }
      }
    });
    
    console.log('Final available sizes:', availableSizes);
    return availableSizes;
  };

  const getProductQuantity = (product: Product): number => {
    console.log('Product quantity_product field:', product.quantity_product);
    console.log('All product fields:', Object.keys(product));
    
    // Check for quantity_product field first
    if (product.quantity_product) {
      const qty = parseInt(product.quantity_product);
      console.log('Parsed quantity:', qty);
      return qty;
    }
    
    // For products without sizes (like ties, pocket squares), assume they have quantity if they exist
    // Check if this product has no size information
    const availableSizes = getAvailableSizes(product);
    if (availableSizes.length === 0) {
      // For accessories like ties, assume quantity of 1 if no explicit quantity
      console.log('No sizes found, defaulting to quantity 1 for accessory');
      return 1;
    }
    
    return 0;
  };

  const handleProductClick = (productId: number) => {
    navigate(`/product/${productId}`);
  };

  const formatQuantityText = (quantity: number): string => {
    if (quantity === 1) {
      return `${quantity} ${t('common:piece')}`;
    } else {
      return `${quantity} ${t('common:pieces')}`;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
      {products.map((product, index) => {
        const availableSizes = getAvailableSizes(product);
        const quantity = getProductQuantity(product);
        const hasAvailableInfo = availableSizes.length > 0 || quantity > 0;
        const hasSecondImage = product.img2 && product.img2.trim() !== '' && product.img2 !== 'null';
        
        console.log('Product:', product.nom_product, 'Has sizes:', availableSizes.length, 'Quantity:', quantity, 'Has available info:', hasAvailableInfo);
        
        return (
          <div 
            key={product.id_product} 
            className="group relative animate-fade-in"
            style={{
              animationDelay: `${(index % 4) * 100}ms`,
              animationFillMode: 'both'
            }}
          >
            <div className="relative">
              {/* Product Image with hover effect */}
              <div 
                className="relative aspect-[3/4] overflow-hidden bg-slate-100 mb-4 md:mb-6 rounded-lg cursor-pointer"
                onClick={() => handleProductClick(product.id_product)}
              >
                {/* Primary Image */}
                <img
                  src={getProductImage(product.img_product, product.id_product.toString())}
                  alt={product.nom_product}
                  className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                    hasSecondImage ? 'group-hover:opacity-0' : ''
                  }`}
                  onError={(e) => {
                    e.currentTarget.src = getProductImage('', product.id_product.toString());
                  }}
                />
                
                {/* Secondary Image - only shown when hovering and img2 exists */}
                {hasSecondImage && (
                  <img
                    src={getProductImage(product.img2, product.id_product.toString())}
                    alt={`${product.nom_product} - Vue alternative`}
                    className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = getProductImage('', product.id_product.toString());
                    }}
                  />
                )}
                
                {/* Discount Badge - Left side */}
                {product.discount_product && parseFloat(product.discount_product) > 0 && (
                  <div className="absolute top-2 md:top-4 left-2 md:left-4 z-10">
                    <span className="bg-red-600 text-white px-2 md:px-3 py-1 text-xs font-medium tracking-widest uppercase rounded">
                      -{parseFloat(product.discount_product)}%
                    </span>
                  </div>
                )}

                {/* Available Sizes/Quantity - Show on Hover with 25% height at bottom */}
                {hasAvailableInfo && (
                  <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-white/95 backdrop-blur-sm flex flex-col justify-center items-center px-3 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
                    {availableSizes.length > 0 ? (
                      <>
                        <div className="text-xs text-slate-600 mb-1 font-medium text-center">
                          {t('products:availableSizes')}
                        </div>
                        <div className="flex flex-wrap gap-1 justify-center">
                          {availableSizes.map((size) => (
                            <span 
                              key={size}
                              className="bg-slate-100 text-slate-700 px-2 py-1 text-xs rounded font-medium"
                            >
                              {size}
                            </span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-xs text-slate-600 mb-1 font-medium text-center">
                          {t('common:available')}
                        </div>
                        <div className="text-xs text-slate-700 font-medium text-center">
                          {formatQuantityText(quantity)}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="text-left px-1 relative">
                {/* Category and Heart on same line */}
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs text-slate-500 tracking-widest uppercase font-medium">
                    {product.category_product} {product.itemgroup_product && `• ${product.itemgroup_product}`}
                  </span>
                  
                  {/* Heart Button - Same line as category */}
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className="w-6 h-6 md:w-8 md:h-8 p-0 bg-white/80 hover:bg-white backdrop-blur-sm rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleLike(product.id_product);
                    }}
                  >
                    <Heart 
                      className={`w-4 h-4 md:w-5 md:h-5 transition-all duration-200 ${
                        likedProducts.has(product.id_product) 
                          ? 'text-red-500 fill-red-500' 
                          : 'text-slate-600 hover:text-red-500'
                      }`} 
                    />
                  </Button>
                </div>
                
                <h3 
                  className="font-serif font-light text-slate-900 mb-3 md:mb-4 text-base md:text-lg leading-snug cursor-pointer hover:text-slate-600 transition-colors"
                  onClick={() => handleProductClick(product.id_product)}
                >
                  {product.nom_product}
                </h3>
                
                <div className="flex items-center gap-2 md:gap-3">
                  {product.discount_product && parseFloat(product.discount_product) > 0 ? (
                    <>
                      <span className="text-base md:text-lg font-medium text-slate-900">
                        {formatPrice(calculateDiscountedPrice(product.price_product, product.discount_product))}
                      </span>
                      <span className="text-sm text-red-500 line-through font-light">
                        {formatPrice(product.price_product)}
                      </span>
                    </>
                  ) : (
                    <span className="text-base md:text-lg font-medium text-slate-900">
                      {formatPrice(product.price_product)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CategoryProducts;
