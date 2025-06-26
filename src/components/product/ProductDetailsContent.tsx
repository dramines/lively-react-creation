import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Truck, CreditCard, ChevronRight, Minus, Plus } from 'lucide-react';
import ProductImageGallery from './ProductImageGallery';
import ProductSizeSelector from './ProductSizeSelector';
import ProductBreadcrumb from './ProductBreadcrumb';
import RelatedProducts from './RelatedProducts';
import YouMayAlsoLike from './YouMayAlsoLike';
import CartModal from '../modals/CartModal';
import HeartButton from '@/components/ui/HeartButton';
import { useCart } from '@/contexts/CartContext';
import { needsSizeSelection } from '@/config/productSizeConfig';
import { getProductImage } from '@/utils/imageUtils';

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
  const { t } = useTranslation(['products']);
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [expandedSection, setExpandedSection] = useState<'delivery' | 'payment' | null>(null);
  const [isCartModalOpen, setIsCartModalOpen] = useState(false);

  const formatPrice = (price: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return `${numPrice} TND`;
  };

  const calculateDiscountedPrice = (price: string | number, discount: string | number) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = typeof discount === 'string' ? parseFloat(discount) : discount;
    return numPrice - (numPrice * numDiscount / 100);
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

  const handleAddToCart = () => {
    // For products that need sizes, require size selection
    if (productNeedsSize && !selectedSize) return;

    const price = product.discount_product && parseFloat(product.discount_product) > 0
      ? calculateDiscountedPrice(product.price_product, product.discount_product)
      : parseFloat(product.price_product);

    addToCart({
      id: product.id_product,
      name: product.nom_product,
      price: typeof price === 'number' ? price : parseFloat(product.price_product),
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

  const breadcrumbData = getBreadcrumbData();

  const toggleSection = (section: 'delivery' | 'payment') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div>
      {/* Breadcrumb */}
      <ProductBreadcrumb 
        category={breadcrumbData.category}
        subcategory={breadcrumbData.subcategory}
        productName={product.nom_product}
      />

      {/* Product Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8">
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
                Lucci
              </p>
            </div>
            
            {/* Heart Button - Now using the HeartButton component */}
            <HeartButton 
              product={product}
              className="w-10 h-10 bg-white hover:bg-slate-50 rounded-full border border-slate-200"
              size="md"
            />
          </div>

          {/* Product Description */}
          {product.description_product && (
            <div className="mb-6">
              <p className="text-slate-600 leading-relaxed">
                {product.description_product}
              </p>
            </div>
          )}

          {/* Price */}
          <div className="mb-6">
            {product.discount_product && parseFloat(product.discount_product) > 0 ? (
              <div className="flex items-center gap-4">
                <span className="text-2xl font-medium text-slate-900">
                  {formatPrice(calculateDiscountedPrice(product.price_product, product.discount_product))}
                </span>
                <span className="text-lg text-red-500 line-through font-light">
                  {formatPrice(product.price_product)}
                </span>
                <span className="bg-red-100 text-red-700 px-3 py-1 text-sm font-medium rounded uppercase tracking-wide">
                  NEW TO SALE
                </span>
              </div>
            ) : (
              <span className="text-2xl font-medium text-slate-900">
                {formatPrice(product.price_product)}
              </span>
            )}
          </div>

          {/* Size Selector - only show for products that need sizes */}
          <ProductSizeSelector 
            product={product}
            selectedSize={selectedSize}
            onSizeSelect={setSelectedSize}
          />

          {/* Quantity Selector - show for all products */}
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

          {/* Add to Bag Button */}
          <Button 
            size="lg" 
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-4 text-base tracking-wide uppercase mb-6"
            disabled={productNeedsSize && !selectedSize}
            onClick={handleAddToCart}
          >
            ADD TO BAG
          </Button>

          {/* Delivery & Payment Options */}
          <div className="space-y-2 mb-8">
            {/* Delivery & Returns */}
            <div className="border border-slate-200 rounded-lg">
              <button
                onClick={() => toggleSection('delivery')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900 uppercase tracking-wide text-sm">
                    DELIVERY & RETURNS
                  </span>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'delivery' ? 'rotate-90' : ''
                  }`} 
                />
              </button>
              {expandedSection === 'delivery' && (
                <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-100">
                  <div className="pt-4 space-y-2">
                    <p><strong>Free delivery</strong> on orders over 150 TND</p>
                    <p><strong>Standard delivery:</strong> 3-5 business days (15 TND)</p>
                    <p><strong>Express delivery:</strong> 1-2 business days (25 TND)</p>
                    <p><strong>Returns:</strong> Free returns within 30 days of purchase</p>
                    <p>Items must be in original condition with tags attached</p>
                  </div>
                </div>
              )}
            </div>

            {/* Payment Options */}
            <div className="border border-slate-200 rounded-lg">
              <button
                onClick={() => toggleSection('payment')}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-slate-600" />
                  <span className="font-medium text-slate-900 uppercase tracking-wide text-sm">
                    PAYMENT OPTIONS
                  </span>
                </div>
                <ChevronRight 
                  className={`w-5 h-5 text-slate-400 transition-transform ${
                    expandedSection === 'payment' ? 'rotate-90' : ''
                  }`} 
                />
              </button>
              {expandedSection === 'payment' && (
                <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-100">
                  <div className="pt-4 space-y-2">
                    <p><strong>Credit & Debit Cards:</strong> Visa, Mastercard, American Express</p>
                    <p><strong>PayPal:</strong> Pay securely with your PayPal account</p>
                    <p><strong>Bank Transfer:</strong> Direct bank transfer available</p>
                    <p><strong>Cash on Delivery:</strong> Pay when you receive your order</p>
                    <p>All payments are processed securely with SSL encryption</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like */}
      <YouMayAlsoLike currentProductId={product.id_product} />

      {/* Related Products */}
      <RelatedProducts 
        currentProductId={product.id_product}
        category={product.category_product}
        itemGroup={product.itemgroup_product}
      />

      {/* Cart Modal */}
      <CartModal
        isOpen={isCartModalOpen}
        onClose={() => setIsCartModalOpen(false)}
        onKeepShopping={handleKeepShopping}
        onGoToCheckout={handleGoToCheckout}
      />
    </div>
  );
};

export default ProductDetailsContent;
