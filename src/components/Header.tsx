
import React, { useState } from "react";
import { Search, ShoppingBag, Menu, X, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useProducts } from "@/context/ProductContext";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import CartDropdown from "./CartDropdown";
import WishlistModal from "./WishlistModal";
import MobileSidebar from "./MobileSidebar";
import ProductDropdown from "./ProductDropdown";
import SearchModal from "./SearchModal";
import CurrencySelector from "./CurrencySelector";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<'fr' | 'en'>('fr');
  const { state } = useCart();
  const { getWishlistCount } = useWishlist();
  const { searchQuery, setSearchQuery } = useProducts();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const categories = [
    { key: "surMesure", label: "Sur Mesure" },
    { key: "pretAPorter", label: "Prêt à Porter" },
    { key: "accessoires", label: "Accessoires" }
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality is handled by the context
    setIsSearchOpen(false);
  };

  const handleCartClick = () => {
    // On mobile, if cart has items, go directly to checkout
    if (isMobile && state.items.length > 0) {
      navigate("/checkout");
    } else {
      setIsCartOpen(!isCartOpen);
    }
  };

  const handleMouseEnter = (key: string) => {
    if (closeTimeout) {
      clearTimeout(closeTimeout);
      setCloseTimeout(null);
    }
    setActiveDropdown(key);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setActiveDropdown(null);
    }, 1000); // Increased timeout to 1000ms for better UX
    setCloseTimeout(timeout);
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        {/* Top banner - aligned to left */}
        <div className="bg-black text-white py-2 text-xs font-light tracking-wide">
          <div className="container mx-auto px-4">
            <p className="text-left font-hm-sans">livraison dans toute la tunisie</p>
          </div>
        </div>

        {/* Main header */}
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Navigation */}
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link to="/">
                <img
                  src="/lovable-uploads/69b552f1-586a-4e89-9275-11ee73acf808.png"
                  alt="Paola Di Battaglia"
                  className="h-16 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                />
              </Link>

              {/* Desktop Navigation */}
              <nav 
                className="hidden md:flex space-x-8"
                onMouseLeave={handleMouseLeave}
              >
                {categories.map((category) => (
                  <div
                    key={category.key}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(category.key)}
                  >
                    <button className="text-black text-sm font-normal hover:text-gray-600 transition-colors duration-200 uppercase outline-none font-hm-sans py-2">
                      {category.label}
                    </button>
                  </div>
                ))}
              </nav>
            </div>

            {/* Right side - Search Input (Desktop) + Icons */}
            <div className="flex items-center space-x-4">
              {/* Desktop Search Input */}
              <div className="hidden md:flex relative">
                <div className="relative flex items-center">
                  <Search className="absolute left-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-80 pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm font-hm-sans bg-gray-50 hover:bg-white transition-colors"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center space-x-0 md:space-x-1 pr-1">
                {/* Favorites heart icon */}
                <button 
                  className="p-2 hover:bg-gray-100 rounded-sm transition-colors relative"
                  onClick={() => setIsWishlistOpen(true)}
                >
                  <Heart size={20} />
                  {getWishlistCount() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-hm-sans">
                      {getWishlistCount()}
                    </span>
                  )}
                </button>

                {/* Mobile Search Icon */}
                <button 
                  className="md:hidden p-2 hover:bg-gray-100 rounded-sm transition-colors"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search size={20} />
                </button>

                {/* Currency Selector */}
                <CurrencySelector />

                {/* Language Switcher */}
                <button 
                  className="p-2 hover:bg-gray-100 rounded-sm transition-colors relative"
                  onClick={() => setCurrentLanguage(currentLanguage === 'fr' ? 'en' : 'fr')}
                  title={currentLanguage === 'fr' ? 'Switch to English' : 'Passer au français'}
                >
                  <img 
                    src={currentLanguage === 'fr' ? '/lovable-uploads/5b964c5a-a240-4af1-8d12-2b158e954f38.png' : '/lovable-uploads/2577a206-a3fd-4051-a8f7-16b818fcf12b.png'} 
                    alt={currentLanguage === 'fr' ? 'Français' : 'English'}
                    className="w-5 h-4 object-cover rounded-sm"
                  />
                </button>

                {/* Shopping cart */}
                <div className="relative">
                  <button 
                    className="p-2 hover:bg-gray-100 rounded-sm transition-colors relative"
                    onClick={handleCartClick}
                  >
                    <ShoppingBag size={20} />
                    {state.itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center text-[10px] font-hm-sans">
                        {state.itemCount}
                      </span>
                    )}
                  </button>

                  <CartDropdown 
                    isOpen={isCartOpen} 
                    onClose={() => setIsCartOpen(false)} 
                  />
                </div>

                {/* Mobile menu button - moved after shopping cart */}
                <button
                  className="md:hidden p-2 hover:bg-gray-100 rounded-sm"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Product Dropdown */}
      <ProductDropdown 
        isOpen={activeDropdown !== null} 
        activeCategory={activeDropdown}
        onClose={() => setActiveDropdown(null)} 
      />
      
      <WishlistModal isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
