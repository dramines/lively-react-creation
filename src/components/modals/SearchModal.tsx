import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Search, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getProductImage } from '@/utils/imageUtils';

interface Product {
  id_product: string;
  nom_product: string;
  img_product: string;
  price_product: string;
  type_product: string;
  category_product: string;
  itemgroup_product: string;
  discount_product?: string;
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const searchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://draminesaid.com/lucci/api/get_all_products.php?search=${encodeURIComponent(searchTerm)}&limit=10`
        );
        const result = await response.json();
        
        if (result.success) {
          setSearchResults(result.data);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(searchProducts, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handleProductClick = (product: Product) => {
    // Save to recent searches
    const newRecentSearches = [product.nom_product, ...recentSearches.filter(s => s !== product.nom_product)].slice(0, 5);
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Navigate to product details
    navigate(`/product/${product.id_product}`);
    onClose();
    setSearchTerm('');
  };

  const handleRecentSearchClick = (term: string) => {
    setSearchTerm(term);
  };

  const formatPrice = (price: string | number, discount?: string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = discount ? parseFloat(discount) : 0;
    
    if (numDiscount > 0) {
      const discountedPrice = numPrice - (numPrice * numDiscount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{discountedPrice.toFixed(0)} TND</span>
          <span className="text-sm text-red-500 line-through">{numPrice.toFixed(0)} TND</span>
        </div>
      );
    }
    
    return <span className="font-medium text-slate-900">{numPrice.toFixed(0)} TND</span>;
  };

  if (!isOpen) return null;

  return (
    <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 animate-fade-in">
      <div className="px-4 md:px-6 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-12 py-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent text-lg"
              autoFocus
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Search Results */}
          {searchTerm.trim() !== '' && (
            <div className="mt-4 max-h-96 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-900 mx-auto"></div>
                  <p className="text-gray-600 text-sm mt-2">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500 mb-3">
                    {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''} trouvé{searchResults.length > 1 ? 's' : ''}
                  </p>
                  {searchResults.map((product) => (
                    <div
                      key={product.id_product}
                      onClick={() => handleProductClick(product)}
                      className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                      <img
                        src={getProductImage(product.img_product, product.id_product)}
                        alt={product.nom_product}
                        className="w-12 h-12 object-cover rounded-md bg-gray-100"
                        onError={(e) => {
                          e.currentTarget.src = getProductImage('', product.id_product);
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-slate-900 truncate">
                          {product.nom_product}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {product.type_product} {product.category_product && `• ${product.category_product}`} • {product.itemgroup_product}
                        </p>
                      </div>
                      <div className="text-right">
                        {formatPrice(product.price_product, product.discount_product)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600">Aucun produit trouvé pour "{searchTerm}"</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Essayez avec d'autres mots-clés
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Recent Searches */}
          {searchTerm.trim() === '' && recentSearches.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recherches récentes
              </p>
              <div className="space-y-1">
                {recentSearches.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleRecentSearchClick(term)}
                    className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Default state */}
          {searchTerm.trim() === '' && recentSearches.length === 0 && (
            <div className="mt-4 text-center">
              <p className="text-gray-600 text-sm">
                Recherchez parmi nos collections de mode premium
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
