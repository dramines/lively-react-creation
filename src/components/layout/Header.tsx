import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Search, ShoppingBag, MapPin, Menu, Heart, Instagram, Facebook, X, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import LanguageSelector from './LanguageSelector';
import CurrencySelector from './CurrencySelector';
import SearchModal from '../modals/SearchModal';
import StoreFinderModal from '../modals/StoreFinderModal';
import CartDropdown from '../modals/CartDropdown';
import WishlistModal from '../modals/WishlistModal';
import ProductDropdown from './ProductDropdown';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getProductImage } from '@/utils/imageUtils';
import { apiCache } from '@/utils/apiCache';
import { secureGet } from '@/services/secureApiService';

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

interface HeaderProps {
  onMenuClick: () => void;
  onContactOpen?: () => void;
  onBookingOpen?: () => void;
}

const Header = ({ onMenuClick, onContactOpen, onBookingOpen }: HeaderProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { getTotalItems } = useCart();
  const { formatPrice: formatCurrencyPrice } = useCurrency();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isStoreFinderOpen, setIsStoreFinderOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Mobile search states
  const [mobileSearchTerm, setMobileSearchTerm] = useState('');
  const [mobileSearchResults, setMobileSearchResults] = useState<Product[]>([]);
  const [mobileSearchLoading, setMobileSearchLoading] = useState(false);
  const [mobileRecentSearches, setMobileRecentSearches] = useState<string[]>([]);

  // Check if we're on the index page
  const isIndexPage = location.pathname === '/';

  const { getWishlistCount } = useWishlist();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Load recent searches for mobile
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setMobileRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (!isSearchOpen || mobileSearchTerm.trim() === '') {
      setMobileSearchResults([]);
      return;
    }

    // Only search if term is at least 2 characters
    if (mobileSearchTerm.trim().length < 2) {
      return;
    }

    const controller = new AbortController();
    
    const searchProducts = async () => {
      const cacheKey = `search-${mobileSearchTerm}-8`;
      const cachedResult = apiCache.get(cacheKey);
      
      if (cachedResult && !controller.signal.aborted) {
        setMobileSearchResults(cachedResult);
        setMobileSearchLoading(false);
        return;
      }

      setMobileSearchLoading(true);
      try {
        const result = await secureGet('products', {
          search: mobileSearchTerm,
          limit: '8'
        });
        
        if (result.success && !controller.signal.aborted) {
          apiCache.set(cacheKey, result.data, 2 * 60 * 1000); // Cache for 2 minutes
          setMobileSearchResults(result.data);
        } else if (!controller.signal.aborted) {
          setMobileSearchResults([]);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error('Search error:', error);
          setMobileSearchResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setMobileSearchLoading(false);
        }
      }
    };

    const timeoutId = setTimeout(searchProducts, 500);
    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [mobileSearchTerm, isSearchOpen]);

  // For non-index pages, always use the non-transparent header
  const shouldUseTransparentHeader = isIndexPage && !isScrolled;

  const navItems = [
    { 
      key: 'surMesure', 
      label: t('products:categories.surMesure'),
      hasDropdown: true,
    },
    { 
      key: 'pretAPorter', 
      label: t('products:categories.pretAPorter'),
      hasDropdown: true,
    },
    { 
      key: 'accessoires', 
      label: t('products:categories.accessoires'),
      hasDropdown: true,
    },
  ];

  const handleSearchToggle = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setMobileSearchTerm('');
      setMobileSearchResults([]);
    }
  };

  const handleStoreFinderOpen = () => {
    setIsStoreFinderOpen(true);
  };

  const handleStoreFinderClose = () => {
    setIsStoreFinderOpen(false);
  };

  const handleCartToggle = () => {
    setIsCartOpen(!isCartOpen);
  };

  const handleCartClose = () => {
    setIsCartOpen(false);
  };

  const handleGoToCheckout = () => {
    setIsCartOpen(false);
    navigate('/checkout');
  };

  const handleMouseEnter = (key: string) => {
    // Clear any existing timeout
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    // Set a 3-second delay before closing the dropdown
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 3000);
    setCloseTimeout(timeout);
  };

  const handleDropdownMouseEnter = () => {
    // Clear the timeout if user hovers over the dropdown
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
  };

  const handleDropdownMouseLeave = () => {
    // Set a 3-second delay when leaving the dropdown
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 3000);
    setCloseTimeout(timeout);
  };

  const handleMobileProductClick = (product: Product) => {
    // Save to recent searches
    const newRecentSearches = [product.nom_product, ...mobileRecentSearches.filter(s => s !== product.nom_product)].slice(0, 5);
    setMobileRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));
    
    // Navigate to product details
    navigate(`/product/${product.id_product}`);
    setIsSearchOpen(false);
    setMobileSearchTerm('');
  };

  const handleMobileRecentSearchClick = (term: string) => {
    setMobileSearchTerm(term);
  };

  const formatPrice = (price: string | number, discount?: string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numDiscount = discount ? parseFloat(discount) : 0;
    
    if (numDiscount > 0) {
      const discountedPrice = numPrice - (numPrice * numDiscount / 100);
      return (
        <div className="flex items-center gap-2">
          <span className="font-medium text-slate-900">{formatCurrencyPrice(discountedPrice)}</span>
          <span className="text-sm text-red-500 line-through">{formatCurrencyPrice(numPrice)}</span>
        </div>
      );
    }
    
    return <span className="font-medium text-slate-900">{formatCurrencyPrice(numPrice)}</span>;
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (closeTimeout) {
        clearTimeout(closeTimeout);
      }
    };
  }, [closeTimeout]);

  return (
    <>
      <div className="relative" onMouseLeave={handleMouseLeave}>
        <header className={`transition-all duration-300 ${
          isIndexPage 
            ? (shouldUseTransparentHeader 
                ? 'bg-transparent' 
                : 'bg-white border-b border-gray-100 shadow-sm')
            : 'bg-white border-b border-gray-100 shadow-sm'
        }`}>
          {/* Main header */}
          <div className="px-4 md:px-6 py-4">
            <div className="flex items-center justify-between relative">
              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={onMenuClick}
              >
                <Menu className={`w-6 h-6 ${shouldUseTransparentHeader ? 'text-white' : 'text-gray-900'}`} />
              </Button>

              {/* Logo - absolutely centered on mobile, normal flex on desktop */}
              <div className="absolute left-1/2 transform -translate-x-1/2 md:relative md:left-auto md:transform-none md:flex-none flex justify-center md:justify-start">
                <Link to="/">
                  {shouldUseTransparentHeader ? (
                    <img 
                      src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                      alt="LUCCI BY E.Y" 
                      className="h-12 md:h-16 object-contain transition-opacity duration-300 hover:opacity-80"
                    />
                  ) : (
                    <img 
                      src="/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png" 
                      alt="LUCCI BY E.Y" 
                      className="h-12 md:h-16 object-contain transition-opacity duration-300 hover:opacity-80"
                    />
                  )}
                </Link>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-8 flex-1 justify-center">
                {navItems.map((item) => (
                  <div
                    key={item.key}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(item.key)}
                  >
                    <button
                      className={`font-medium transition-colors duration-200 relative group ${
                        shouldUseTransparentHeader 
                          ? 'text-white hover:text-blue-200' 
                          : 'text-gray-700 hover:text-blue-900'
                      }`}
                    >
                      {item.label}
                      <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                        shouldUseTransparentHeader ? 'bg-white' : 'bg-blue-900'
                      }`}></span>
                    </button>
                  </div>
                ))}

                {/* Contact button with same style as nav items */}
                <Link
                  to="/contact"
                  className={`font-medium transition-colors duration-200 relative group ${
                    shouldUseTransparentHeader 
                      ? 'text-white hover:text-blue-200' 
                      : 'text-gray-700 hover:text-blue-900'
                  }`}
                >
                  Contacter Nous
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-300 group-hover:w-full ${
                    shouldUseTransparentHeader ? 'bg-white' : 'bg-blue-900'
                  }`}></span>
                </Link>
              </nav>

              {/* Right side icons - reduced spacing */}
              <div className="flex items-center space-x-0.5 md:space-x-1">
                {/* Desktop Search */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex"
                  onClick={handleSearchToggle}
                >
                  <Search className={`w-5 h-5 ${shouldUseTransparentHeader ? 'text-white' : 'text-gray-900'}`} />
                </Button>
                
                {/* Mobile Search (replaces heart) */}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={handleSearchToggle}
                >
                  <Search className={`w-5 h-5 ${shouldUseTransparentHeader ? 'text-white' : 'text-gray-900'}`} />
                </Button>

              {/* Desktop Heart (favorites) */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="hidden md:flex relative"
                  onClick={() => setIsWishlistOpen(true)}
                >
                  <Heart 
                    className={`w-5 h-5 ${
                      shouldUseTransparentHeader ? 'text-white' : 'text-gray-900'
                    } ${getWishlistCount() > 0 ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      {getWishlistCount()}
                    </span>
                  )}
                </Button>
              </div>

                {/* Currency Selector */}
                <div className="hidden md:flex items-center">
                  <CurrencySelector variant={shouldUseTransparentHeader ? 'white' : 'default'} />
                </div>

                {/* Cart Button with Dropdown */}
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="relative"
                    onClick={handleCartToggle}
                  >
                    <ShoppingBag className={`w-5 h-5 ${shouldUseTransparentHeader ? 'text-white' : 'text-gray-900'}`} />
                    {getTotalItems() > 0 && (
                      <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        {getTotalItems()}
                      </span>
                    )}
                  </Button>
                  
                  <CartDropdown
                    isOpen={isCartOpen}
                    onClose={handleCartClose}
                    onGoToCheckout={handleGoToCheckout}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Search Dropdown - Increased height */}
          {isSearchOpen && (
            <div className="md:hidden border-t border-gray-100 animate-fade-in bg-white">
              <div className="px-4 py-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Rechercher parmi nos collections premium"
                    value={mobileSearchTerm}
                    onChange={(e) => setMobileSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
                    autoFocus
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearchToggle}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Mobile Search Results - Increased max height */}
                {mobileSearchTerm.trim() !== '' && (
                  <div className="max-h-[435px] overflow-y-auto">
                    {mobileSearchLoading ? (
                      <div className="text-center py-8">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-900 mx-auto"></div>
                        <p className="text-gray-600 text-sm mt-2">Recherche...</p>
                      </div>
                    ) : mobileSearchResults.length > 0 ? (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-500 mb-3">
                          {mobileSearchResults.length} résultat{mobileSearchResults.length > 1 ? 's' : ''} trouvé{mobileSearchResults.length > 1 ? 's' : ''}
                        </p>
                        {mobileSearchResults.map((product) => (
                          <div
                            key={product.id_product}
                            onClick={() => handleMobileProductClick(product)}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                          >
                            <img
                              src={getProductImage(product.img_product, product.id_product)}
                              alt={product.nom_product}
                              className="w-10 h-10 object-cover rounded-md bg-gray-100"
                              onError={(e) => {
                                e.currentTarget.src = getProductImage('', product.id_product);
                              }}
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-slate-900 truncate text-sm">
                                {product.nom_product}
                              </h4>
                              <p className="text-xs text-gray-500">
                                {product.type_product} • {product.itemgroup_product}
                              </p>
                            </div>
                            <div className="text-right text-sm">
                              {formatPrice(product.price_product, product.discount_product)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-600 text-sm">Aucun produit trouvé</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Essayez avec d'autres mots-clés
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Mobile Recent Searches */}
                {mobileSearchTerm.trim() === '' && mobileRecentSearches.length > 0 && (
                  <div>
                    <p className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Recherches récentes
                    </p>
                    <div className="space-y-1">
                      {mobileRecentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleMobileRecentSearchClick(term)}
                          className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-md transition-colors text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mobile Default state */}
                {mobileSearchTerm.trim() === '' && mobileRecentSearches.length === 0 && (
                  <div className="text-center py-4">
                    <p className="text-gray-600 text-sm">
                      Recherchez parmi nos collections premium
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Desktop Search Modal */}
          <SearchModal isOpen={isSearchOpen && window.innerWidth >= 768} onClose={() => setIsSearchOpen(false)} />
          
          {/* Store Finder Modal */}
          <StoreFinderModal isOpen={isStoreFinderOpen} onClose={handleStoreFinderClose} />

          {/* Wishlist Modal */}
          <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
        </header>

        {/* Product Dropdown - positioned directly below header without gap */}
        <div 
          className="relative"
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <ProductDropdown 
            isOpen={activeDropdown !== null} 
            activeCategory={activeDropdown}
            onClose={() => setActiveDropdown(null)} 
          />
        </div>
      </div>
    </>
  );
};

export default Header;
