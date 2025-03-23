
import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useIsMobile } from "../hooks/use-mobile";

// Define types
interface SubMenuItem {
  label: string;
  href: string;
  category: string;
  subcategory?: string;
  translationKey: string;
  productId?: string;
}

interface MenuItem {
  label: string;
  translationKey: string;
  items?: SubMenuItem[];
  directLink?: {
    href: string;
    category: string;
    productId?: string;
  };
}

// Define the menu structure
const MENU_ITEMS: MenuItem[] = [
  {
    label: "Dattes",
    translationKey: "navbar.dates",
    directLink: {
      href: "products",
      category: "dattes-fraiches,dattes-transformees"
    },
    items: [
      { label: "Coffret de Dattes", href: "products", category: "dattes-fraiches", subcategory: "coffret-cadeaux", translationKey: "navbar.gift_box" },
      { label: "Paquet de Dattes", href: "products", category: "dattes-fraiches", subcategory: "paquet", translationKey: "navbar.packages" },
      { label: "Barquette de Dattes", href: "products", category: "dattes-transformees", subcategory: "barquette", translationKey: "navbar.trays" }
    ]
  },
  {
    label: "Figues Séchées",
    translationKey: "navbar.dried_figs",
    directLink: {
      href: "products",
      category: "figues-sechees-djebaa,figues-sechees-zidi,figues-sechees-toujane,figues-sechees-vrac"
    },    
    items: [
      { label: "Figues djebaa", href: "products", category: "figues-sechees-djebaa", productId: "15", translationKey: "navbar.djebaa_figs" },
      { label: "Figues ZIDI 200g", href: "products", category: "figues-sechees-zidi", productId: "9", translationKey: "navbar.zidi_figs" },
      { label: "Figues Toujane", href: "products", category: "figues-sechees-toujane", productId: "14", translationKey: "navbar.toujane_figs" },
      { label: "Figues Séchées en Vrac", href: "products", category: "figues-sechees-vrac", productId: "10", translationKey: "navbar.bulk_dried_figs" }
    ]
  },
  {
    label: "Sirop de Dattes",
    translationKey: "navbar.date_syrup",
    directLink: {
      href: "products",
      category: "sirop-dattes",
      productId: "13"  // Correct productId for Sirop de Dattes
    }
  },
  {
    label: "Sucre de Dattes",
    translationKey: "navbar.date_sugar",
    directLink: {
      href: "products",
      category: "sucre-dattes",
      productId: "12"  // Correct productId for Sucre de Dattes
    }
  },
  {
    label: "Café de Dattes",
    translationKey: "navbar.date_coffee",
    directLink: {
      href: "products",
      category: "cafe-dattes",
      productId: "11"  // Correct productId for Café de Dattes
    }
  }
];

interface ProductsDropdownProps {
  onPageChange: (page: string, category?: string, subcategory?: string, productId?: string) => void;
}

const ProductsDropdown = ({ onPageChange }: ProductsDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { t } = useTranslation();
  const isMobile = useIsMobile();

  const handleClick = (href: string, category: string, subcategory?: string, productId?: string, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    // Always pass the productId parameter to ensure proper filtering
    onPageChange(href, category, subcategory, productId);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  // Handle mouse enter for the main dropdown
  const handleDropdownEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMainProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onPageChange("products-all");
    setIsOpen(false);
    setActiveSubmenu(null);
  };
  
  // Handle mouse leave for the main dropdown with a delay
  const handleDropdownLeave = () => {
    // Add a significant delay before closing the dropdown
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveSubmenu(null);
    }, 300); // 300ms delay before closing
  };

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setActiveSubmenu(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any lingering timeouts on unmount
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  // Mobile specific handling for submenu
  const handleMobileItemClick = (item: MenuItem) => {
    // If item has submenus, toggle the submenu state
    if (item.items && item.items.length > 0) {
      setActiveSubmenu(activeSubmenu === item.translationKey ? null : item.translationKey);
    } else if (item.directLink) {
      // If it's a direct link, navigate directly
      handleClick(
        item.directLink.href, 
        item.directLink.category, 
        undefined, 
        item.directLink.productId
      );
    }
  };

  return (
    <div 
      className="relative group" 
      ref={dropdownRef}
      onMouseEnter={!isMobile ? handleDropdownEnter : undefined}
      onMouseLeave={!isMobile ? handleDropdownLeave : undefined}
    >
      {/* Main Dropdown Button */}
      <button
        onClick={handleMainProductsClick}
        className="flex items-center gap-1 text-gray-700 hover:text-[#96cc39] transition-colors py-2"
      >
        {t('navbar.products')}
        <ChevronDown className="w-4 h-4" />
      </button>

      {/* Main Dropdown Menu */}
      {isOpen && (
        <div className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 ${isMobile ? 'w-full' : 'w-64'}`}>
          {MENU_ITEMS.map((item) => (
            <div 
              key={item.translationKey} 
              className="relative group"
              onMouseEnter={!isMobile ? () => setActiveSubmenu(item.items && item.items.length > 0 ? item.translationKey : null) : undefined}
            >
              {/* Main Category Item - Either with submenu or direct link */}
              <a 
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  if (isMobile) {
                    handleMobileItemClick(item);
                  } else {
                    handleClick(
                      item.directLink?.href || "products", 
                      item.directLink?.category || "tous", 
                      undefined,
                      item.directLink?.productId,
                      e
                    );
                  }
                }}
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39] ${activeSubmenu === item.translationKey && isMobile ? 'bg-gray-50 text-[#96cc39]' : ''}`}
              >
                {t(item.translationKey)}
                {item.items && item.items.length > 0 && (
                  <ChevronRight className="w-4 h-4" />
                )}
              </a>

              {/* Desktop submenu - Appears aligned to the right */}
              {!isMobile && item.items && item.items.length > 0 && activeSubmenu === item.translationKey && (
                <div 
                  className="absolute top-0 left-full ml-0 w-72 bg-white rounded-lg shadow-lg border border-gray-100 py-2"
                  style={{ marginLeft: '1px' }} // Ensure there's no gap between menus
                >
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.translationKey}
                      href="#"
                      onClick={(e) => handleClick(subItem.href, subItem.category, subItem.subcategory, subItem.productId, e)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39]"
                    >
                      {t(subItem.translationKey)}
                    </a>
                  ))}
                </div>
              )}

              {/* Mobile expanded submenu - Appears below the parent */}
              {isMobile && item.items && item.items.length > 0 && activeSubmenu === item.translationKey && (
                <div className="bg-gray-50 py-2">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.translationKey}
                      href="#"
                      onClick={(e) => handleClick(subItem.href, subItem.category, subItem.subcategory, subItem.productId, e)}
                      className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#96cc39]"
                    >
                      {t(subItem.translationKey)}
                    </a>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsDropdown;
