
import { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { ProductCategory } from '../../types/product';
import { useIsMobile } from '../../hooks/use-mobile';

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
  directLink?: {
    href: string;
    category: string;
    productId?: string;
  };
  items?: SubMenuItem[];
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
  const isMobile = useIsMobile();

  const handleClick = (href: string, category: string, subcategory?: string, productId?: string, e: React.MouseEvent = {} as React.MouseEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    console.log('ProductsDropdown handleClick:', { href, category, subcategory, productId });
    // Always pass the productId parameter to ensure proper product filtering
    onPageChange(href, category, subcategory, productId);
    setIsOpen(false);
    setActiveSubmenu(null);
  };

  // Handle mobile menu item click
  const handleMobileItemClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (isMobile) {
      if (item.directLink) {
        // If it's a direct link item, navigate directly
        handleClick(
          item.directLink.href, 
          item.directLink.category, 
          undefined, 
          item.directLink.productId
        );
      } else {
        // Toggle submenu on mobile for items with children
        setActiveSubmenu(prevState => prevState === item.translationKey ? null : item.translationKey);
      }
    }
  };

  // Handle clicking a direct menu item
  const handleMainMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (item.directLink) {
      handleClick(
        item.directLink.href,
        item.directLink.category,
        undefined,
        item.directLink.productId,
        e
      );
    } else if (!isMobile) {
      setActiveSubmenu(item.translationKey);
    }
  };

  return (
    <div className="relative group">
      <button
        onMouseEnter={() => !isMobile && setIsOpen(true)}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-4 py-2 text-gray-700 hover:text-[#96cc39] transition-colors"
      >
        Produits
        <ChevronDown className="w-4 h-4" />
      </button>

      {isOpen && (
        <div
          onMouseLeave={() => {
            if (!isMobile) {
              setIsOpen(false);
              setActiveSubmenu(null);
            }
          }}
          className={`absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-100 py-2 z-50 ${isMobile ? 'w-full' : 'w-56'}`}
        >
          {MENU_ITEMS.map((item) => (
            <div
              key={item.translationKey}
              className="relative"
              onMouseEnter={() => !isMobile && setActiveSubmenu(item.translationKey)}
            >
              <button
                className={`w-full flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39] ${isMobile && activeSubmenu === item.translationKey ? 'bg-gray-50 text-[#96cc39]' : ''}`}
                onClick={(e) => isMobile ? handleMobileItemClick(item, e) : handleMainMenuClick(item, e)}
              >
                {item.label}
                {item.items && item.items.length > 0 && <ChevronRight className="w-4 h-4" />}
              </button>

              {/* Desktop submenu */}
              {!isMobile && activeSubmenu === item.translationKey && item.items && (
                <div className="absolute top-0 left-full ml-1 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.translationKey}
                      href="#"
                      onClick={(e) => handleClick(subItem.href, subItem.category, subItem.subcategory, subItem.productId, e)}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#96cc39]"
                    >
                      {subItem.label}
                    </a>
                  ))}
                </div>
              )}

              {/* Mobile expanded submenu */}
              {isMobile && activeSubmenu === item.translationKey && item.items && (
                <div className="bg-gray-50 py-1">
                  {item.items.map((subItem) => (
                    <a
                      key={subItem.translationKey}
                      href="#"
                      onClick={(e) => handleClick(subItem.href, subItem.category, subItem.subcategory, subItem.productId, e)}
                      className="block px-8 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#96cc39]"
                    >
                      {subItem.label}
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
