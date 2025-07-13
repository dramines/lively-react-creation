import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, ChevronRight, Minus, Plus, ArrowLeft, Shield, Clock, RotateCcw, Ruler, ShoppingBag } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ProductSizeSelector from './ProductSizeSelector';
import YouMayAlsoLike from './YouMayAlsoLike';
import CartModal from '../modals/CartModal';
import SizeGuideModal from '../modals/SizeGuideModal';
import HeartButton from '@/components/ui/HeartButton';
import { useCart } from '@/contexts/CartContext';
import { needsSizeSelection } from '@/config/productSizeConfig';
import { getProductImage } from '@/utils/imageUtils';
import { useCurrency } from '@/contexts/CurrencyContext';

interface Product {
  id_product: string;
  reference_product: string;
  nom_product: string;
  img_product: string;
  img2_product?: string;
  img3_product?: string;
  img4_product?: string;
  description_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  price_product: string;
  qnty_product: string;
  color_product: string;
  status_product: string;
  discount_product?: string;
  createdate_product: string;
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

interface ProductDetailsContentProps {
  product: Product;
}

const ProductDetailsContent = ({ product }: ProductDetailsContentProps) => {
  const { t } = useTranslation(['products', 'delivery']);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedSection, setExpandedSection] = useState<'delivery' | 'payment' | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const { formatPrice: formatCurrencyPrice } = useCurrency();
  
  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return formatCurrencyPrice(numPrice);
  };

  const getProductImages = () => {
    const images = [getProductImage(product.img_product, product.id_product)];
    if (product.img2_product && product.img2_product.trim() !== '' && product.img2_product !== 'null') {
      images.push(getProductImage(product.img2_product, product.id_product));
    }
    if (product.img3_product && product.img3_product.trim() !== '' && product.img3_product !== 'null') {
      images.push(getProductImage(product.img3_product, product.id_product));
    }
    if (product.img4_product && product.img4_product.trim() !== '' && product.img4_product !== 'null') {
      images.push(getProductImage(product.img4_product, product.id_product));
    }
    return images;
  };

  const getBreadcrumbData = () => {
    if (product.category_product && product.category_product.trim() !== '') {
      return {
        category: product.category_product,
        subcategory: product.itemgroup_product
      };
    }
    
    // For prêt à porter and accessoires (empty category)
    if (product.type_product === 'prêt à porter') {
      return {
        category: 'pretAPorter',
        subcategory: product.itemgroup_product
      };
    }
    
    if (product.type_product === 'accessoires') {
      return {
        category: 'accessoires',
        subcategory: product.itemgroup_product
      };
    }
    
    return {
      category: product.type_product || 'products',
      subcategory: product.itemgroup_product
    };
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  // Use the new configuration to check if product needs sizes
  const productNeedsSize = needsSizeSelection(product.itemgroup_product);

  const checkOutOfStock = () => {
    if (productNeedsSize) {
      // For products that need sizes, check if any size has quantity > 0
      const sizeFields = ['xs_size', 's_size', 'm_size', 'l_size', 'xl_size', 'xxl_size', '3xl_size', '4xl_size', '48_size', '50_size', '52_size', '54_size', '56_size', '58_size'];
      return !sizeFields.some(field => {
        const sizeValue = product[field as keyof Product] as string;
        return sizeValue && parseInt(sizeValue) > 0;
      });
    } else {
      // For products without sizes, check main quantity
      return !product.qnty_product || parseInt(product.qnty_product) <= 0;
    }
  };

  const isOutOfStock = checkOutOfStock();

  const handleAddToCart = () => {
    // For products that need sizes, require size selection
    if (productNeedsSize && !selectedSize) return;

    // Always use the original price (ignore discount)
    const price = parseFloat(product.price_product);

    addToCart({
      id: product.id_product,
      name: product.nom_product,
      price: price,
      size: productNeedsSize ? selectedSize : 'One Size',
      image: getProductImage(product.img_product, product.id_product),
      color: product.color_product
    }, quantity);

    setIsCartModalOpen(true);
  };

  const handleKeepShopping = () => {
    setIsCartModalOpen(false);
  };

  const handleGoToCheckout = () => {
    setIsCartModalOpen(false);
    // Here you would navigate to checkout page
    console.log('Navigate to checkout');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  const breadcrumbData = getBreadcrumbData();

  const toggleSection = (section: 'delivery' | 'payment') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  // Check if product needs size guide (for costumes, vestes, suits, jackets)
  const needsSizeGuide = () => {
    const itemGroup = product.itemgroup_product?.toLowerCase() || '';
    const productName = product.nom_product?.toLowerCase() || '';
    return itemGroup.includes('costume') || 
           itemGroup.includes('veste') || 
           itemGroup.includes('blazer') ||
           itemGroup.includes('jacket') ||
           productName.includes('costume') ||
           productName.includes('veste') ||
           productName.includes('blazer') ||
           productName.includes('jacket');
  };

  return (
    <div>
      {/* Back Button */}
      <div className="mb-6">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleGoBack}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 px-0"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
      </div>

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
        {/* Product Images */}
        <ProductImageGallery 
          images={getProductImages()}
          productName={product.nom_product}
        />

        {/* Product Info */}
        <div className="lg:py-8">
          {/* Product Category */}
          <div className="mb-4">
            <span className="text-sm text-slate-500 tracking-widest uppercase font-medium">
              {product.category_product && product.category_product.trim() !== '' 
                ? `${product.category_product} / ${product.type_product}` 
                : product.type_product
              } / {product.itemgroup_product}
            </span>
          </div>

          {/* Product Title */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif font-light text-slate-900 mb-2">
                {product.nom_product}
              </h1>
              <p className="text-lg text-slate-600 font-light">
                Lucci By E.Y
              </p>
            </div>
            
            {/* Heart Button - Now using the HeartButton component */}
            <HeartButton 
              product={product}
              className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full border border-slate-200"
              size="md"
            />
          </div>

          {/* Product Description - Updated to render HTML properly */}
          {product.description_product && (
            <div className="mb-6">
              <div 
                className="text-slate-600 leading-relaxed product-description"
                dangerouslySetInnerHTML={{ __html: product.description_product }}
              />
              <style>{`
                .product-description p {
                  margin-bottom: 0.75rem;
                }
                .product-description p:last-child {
                  margin-bottom: 0;
                }
                .product-description ol,
                .product-description ul {
                  padding-left: 0 !important;
                  margin-left: 0 !important;
                  margin-bottom: 0.75rem;
                }
                .product-description ol li,
                .product-description ul li {
                  padding-left: 1.5em !important;
                  margin-left: 0 !important;
                  margin-bottom: 0.25rem;
                }
                .product-description ol li::before,
                .product-description ul li::before {
                  left: 0 !important;
                }
                .product-description br {
                  display: block;
                  margin: 0.5rem 0;
                  content: "";
                }
                .product-description strong {
                  font-weight: 600;
                }
                .product-description em {
                  font-style: italic;
                }
              `}</style>
            </div>
          )}

          {/* Price - Always show original price without discount */}
          <div className="mb-6">
            <span className="text-2xl font-medium text-slate-900">
              {formatPrice(product.price_product)}
            </span>
          </div>

          {/* Out of Stock Message */}
          {isOutOfStock && (
            <div className="mb-6">
              <span className="text-red-600 font-medium">
                {t('outOfStock')}
              </span>
            </div>
          )}

          {/* Size Selector - only show for products that need sizes and are in stock */}
          {!isOutOfStock && (
            <ProductSizeSelector 
              product={product}
              selectedSize={selectedSize}
              onSizeSelect={setSelectedSize}
            />
          )}

          {/* Size Guide Button - show for products that need size guide */}
          {needsSizeGuide() && (
            <div className="mb-6">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSizeGuideOpen(true)}
                className="flex items-center gap-2 text-slate-600 hover:text-slate-900"
              >
                <Ruler className="w-4 h-4" />
                Guide des tailles
              </Button>
            </div>
          )}

          {/* Quantity Selector - show for all products that are in stock */}
          {!isOutOfStock && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-slate-900 uppercase tracking-wide">
                  QUANTITÉ:
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 hover:bg-slate-50"
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-xl font-semibold text-slate-900 min-w-[3rem] text-center">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-10 h-10 p-0 hover:bg-slate-50"
                  onClick={() => handleQuantityChange(quantity + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}

          {/* Add to Bag Button - hide when out of stock */}
          {!isOutOfStock && (
            <Button 
              size="lg" 
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-6 text-base tracking-wide uppercase mb-6 flex items-center justify-center gap-3"
              disabled={productNeedsSize && !selectedSize}
              onClick={handleAddToCart}
            >
              <ShoppingBag className="w-5 h-5" />
              {t('addToBag')}
            </Button>
          )}

          {/* Delivery & Payment Options */}
          <div className="space-y-3 mb-8">
            {/* Delivery & Returns */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('delivery')}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <Truck className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 text-base">
                      {t('deliveryReturns')}
                    </span>
                    <p className="text-sm text-slate-600 mt-1">
                      Livraison gratuite dès 150 TND
                    </p>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'delivery' ? 'rotate-90' : ''
                  }`} 
                />
              </button>
              {expandedSection === 'delivery' && (
                <div className="px-5 pb-5 bg-slate-50 border-t border-slate-100">
                  <div className="pt-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <Truck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t('delivery:freeDelivery')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Clock className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t('delivery:standardDelivery')}</p>
                        <p className="font-medium text-slate-900 text-sm mt-1">{t('delivery:expressDelivery')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center mt-0.5">
                        <RotateCcw className="w-3 h-3 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t('delivery:freeReturns')}</p>
                        <p className="text-xs text-slate-600 mt-1">{t('delivery:returnConditions')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('payment')}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                    <CreditCard className="w-5 h-5 text-slate-700" />
                  </div>
                  <div>
                    <span className="font-semibold text-slate-900 text-base">
                      {t('paymentOptions')}
                    </span>
                    <p className="text-sm text-slate-600 mt-1">
                      Paiement sécurisé garanti
                    </p>
                  </div>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'payment' ? 'rotate-90' : ''
                  }`} 
                />
              </button>
              {expandedSection === 'payment' && (
                <div className="px-5 pb-5 bg-slate-50 border-t border-slate-100">
                  <div className="pt-4 space-y-4">
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start gap-3">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <CreditCard className="w-3 h-3 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 text-sm">{t('delivery:creditDebitCards')}</p>
                        </div>
                      </div>
                      <div className="ml-9">
                        <img 
                          src="/lovable-uploads/6ae71c51-8aec-40a3-9ee7-1f91411ff60f.png" 
                          alt="Credit Cards"
                          className="h-8 w-auto object-contain"
                        />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center mt-0.5">
                        <span className="text-orange-600 font-bold text-xs">₹</span>
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t('delivery:cashOnDelivery')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                        <Truck className="w-3 h-3 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 text-sm">{t('delivery:storeCollection')}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 mt-4 pt-3 border-t border-slate-200">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                        <Shield className="w-3 h-3 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-600">{t('delivery:securePayment')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like - Only this section remains */}
      <YouMayAlsoLike currentProductId={product.id_product} />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onKeepShopping={handleKeepShopping}
        onGoToCheckout={handleGoToCheckout}
      />

      {/* Size Guide Modal */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        category="suits"
      />
    </div>
  );
};

export default ProductDetailsContent;
