
import { useTranslation } from 'react-i18next';
import { getItemGroupSizeType, getSizeFieldsForItemGroup, needsSizeSelection } from '@/config/productSizeConfig';
import { SIZE_DISPLAY_NAMES } from '@/data/productCategories';

interface Product {
  itemgroup_product: string;
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

interface ProductSizeSelectorProps {
  product: Product;
  selectedSize: string;
  onSizeSelect: (size: string) => void;
}

const ProductSizeSelector = ({ product, selectedSize, onSizeSelect }: ProductSizeSelectorProps) => {
  const { t } = useTranslation(['products']);

  // Check if this product needs size selection based on configuration
  if (!needsSizeSelection(product.itemgroup_product)) {
    return null;
  }

  const getSizeAvailability = () => {
    const sizeFields = getSizeFieldsForItemGroup(product.itemgroup_product);
    const sizes: { size: string; available: boolean; quantity: number }[] = [];
    
    sizeFields.forEach(sizeField => {
      const sizeValue = product[sizeField as keyof Product] as string;
      const quantity = sizeValue ? parseInt(sizeValue) : 0;
      const displayName = SIZE_DISPLAY_NAMES[sizeField];
      
      if (displayName) {
        sizes.push({
          size: displayName,
          available: quantity > 0,
          quantity
        });
      }
    });
    
    return sizes;
  };

  const sizeAvailability = getSizeAvailability();
  const sizeType = getItemGroupSizeType(product.itemgroup_product);

  if (sizeAvailability.length === 0) {
    return null;
  }

  // Get appropriate label based on size type
  const getSizeLabel = () => {
    switch (sizeType) {
      case 'formal':
        return 'TAILLE:';
      case 'shoe':
        return 'POINTURE:';
      case 'standard':
      default:
        return 'SIZE:';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-sm font-medium text-slate-900 uppercase tracking-wide">
          {getSizeLabel()}
        </span>
        {sizeType !== 'shoe' && (
          <button className="text-sm text-slate-600 underline hover:text-slate-900">
            Size Chart
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {sizeAvailability.map(({ size, available }) => (
          <button
            key={size}
            onClick={() => available && onSizeSelect(size)}
            disabled={!available}
            className={`
              relative aspect-square border-2 rounded text-sm font-medium transition-all duration-200
              ${available 
                ? selectedSize === size
                  ? 'border-slate-900 bg-slate-900 text-white'
                  : 'border-slate-300 text-slate-900 hover:border-slate-600'
                : 'border-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span className="absolute inset-0 flex items-center justify-center">
              {size}
            </span>
            {!available && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-px bg-slate-400 rotate-45"></div>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductSizeSelector;
