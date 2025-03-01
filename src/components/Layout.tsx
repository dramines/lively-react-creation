import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, ClipboardList, Search, Menu, X, Percent, ChevronRight, Facebook, Instagram, Youtube, ArrowLeft, MessageSquare } from "lucide-react";
import Footer from "./Footer";
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { menuItems } from '../config/menuConfig';
import { products } from '../config/products';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CategoryLink = ({ 
  href, 
  topText, 
  bottomText, 
  subItems 
}: { 
  href: string; 
  topText: string; 
  bottomText: string;
  subItems?: Array<{
    title: string;
    description: string;
    image: string;
    path: string;
  }>; 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <NavigationMenuItem>
      <NavigationMenuTrigger 
        className={cn(
          "h-auto py-2",
          location.pathname === href && "border-2 border-primary rounded-md bg-transparent text-primary"
        )} 
        onClick={() => navigate(href)}
      >
        <div className="flex flex-col text-left min-w-max px-3 rounded-md transition-all">
          <span className="text-sm font-medium text-gray-800 whitespace-nowrap">
            {topText}
          </span>
          <span className="text-xs text-gray-600 whitespace-nowrap">
            {bottomText}
          </span>
        </div>
      </NavigationMenuTrigger>
      {subItems && (
        <NavigationMenuContent className="absolute left-0 w-screen data-[motion^=from-]:animate-in data-[motion^=to-]:animate-out data-[motion^=from-]:fade-in data-[motion^=to-]:fade-out data-[motion=from-end]:slide-in-from-right-52 data-[motion=from-start]:slide-in-from-left-52 data-[motion=to-end]:slide-out-to-right-52 data-[motion=to-start]:slide-out-to-left-52">
          <div className="w-screen flex justify-center">
            <div className="w-[80vw] p-6 bg-white rounded-lg shadow-lg">
              <div className="grid grid-cols-4 gap-6">
                <div className="col-span-3 grid grid-cols-3 gap-6">
                  {subItems.map((item) => (
                    <NavigationMenuLink
                      key={item.path}
                      asChild
                    >
                      <Link
                        to={item.path}
                        className="block p-4 space-y-2 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                          <img 
                            src={item.image} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">{item.description}</p>
                      </Link>
                    </NavigationMenuLink>
                  ))}
                </div>
                <div className="col-span-1">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100 w-full">
                    <img 
                      src={href === "/vetements-cuisine" ? "/VetementDeCuisine/vestedecuisineImagebanner.jpg" : subItems[0].image} 
                      alt={topText}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="font-medium text-gray-900">{topText}</h3>
                    <p className="text-sm text-gray-500 mt-1">{bottomText}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NavigationMenuContent>
      )}
    </NavigationMenuItem>
  );
};

export const Layout = () => {
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<typeof menuItems[0] | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const filteredProducts = searchQuery.length > 0
    ? products.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  useEffect(() => {
    const favoritesStr = localStorage.getItem('favorites');
    if (favoritesStr) {
      try {
        const parsedFavorites = JSON.parse(favoritesStr);
        setFavorites(parsedFavorites);
      } catch (error) {
        console.error('Error parsing favorites:', error);
        setFavorites([]);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    const designs = sessionStorage.getItem('designs');
    if (designs) {
      try {
        const parsedDesigns = JSON.parse(designs);
        setCartCount(Array.isArray(parsedDesigns) ? parsedDesigns.length : 0);
      } catch (error) {
        console.error('Error parsing designs from sessionStorage:', error);
        setCartCount(0);
      }
    } else {
      setCartCount(0);
    }
  }, [location.pathname]);

  const openSubmenu = (item: typeof menuItems[0]) => {
    setActiveMenuItem(item);
    setIsSubmenuOpen(true);
  };

  const handleNavigation = (path: string) => {
    setIsSubmenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="w-full bg-[#FFD700] py-2">
        <div className="container mx-auto text-center text-sm font-medium flex items-center justify-center gap-2">
          <Percent className="h-4 w-4" />
          <span>Livraison offerte dès 69TND d'achats !</span>
        </div>
      </div>

      <nav className="w-full bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4 px-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-[300px]">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="text-left">Menu</SheetTitle>
                </SheetHeader>
                
                <div className="bg-white p-4 flex items-center justify-center border-b">
                  <img src="/logo.png" alt="ELLES" className="h-12" />
                </div>

                <div className="divide-y">
                  {menuItems.map((item, index) => (
                    <button
                      key={index}
                      className={cn(
                        "w-full flex items-center justify-between p-4 hover:bg-gray-50",
                        location.pathname === item.path && "border-2 border-primary text-primary rounded-md"
                      )}
                      onClick={() => openSubmenu(item)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-sm font-medium text-left">{item.title}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </button>
                  ))}
                </div>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="ELLES" className="h-14" />
            </Link>

            <div className="flex-1 max-w-2xl px-8 hidden md:block">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Recherchez votre vêtement professionnel"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  className="w-full px-4 py-2.5 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A6E6]/20 focus:border-[#00A6E6] transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                
                {showSearchResults && searchQuery.length > 0 && (
                  <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border max-h-[400px] overflow-y-auto">
                    {filteredProducts.length > 0 ? (
                      <div className="p-2">
                        {filteredProducts.map((product) => (
                          <button
                            key={product.id}
                            className="w-full text-left p-3 hover:bg-gray-50 rounded-md transition-colors flex items-center gap-3"
                            onClick={() => {
                              setShowSearchResults(false);
                              setSearchQuery("");
                              navigate(`/${product.category}#products`);
                            }}
                          >
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img
                                src={product.image || '/placeholder.png'}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{product.name}</div>
                              <div className="text-sm text-gray-500">{product.description}</div>
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 text-center text-gray-500">
                        Aucun résultat trouvé pour "{searchQuery}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6">
              <button
                onClick={() => navigate('/favorites')}
                className="hidden md:flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <Heart className="h-6 w-6" />
                <span className="text-sm font-medium">Wishlist</span>
              </button>

              <button
                onClick={() => navigate('/cart')}
                className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
              >
                <ShoppingCart className="h-6 w-6" />
                <span className="text-sm font-medium hidden md:inline">Panier</span>
              </button>

              <button
                onClick={() => navigate('/devis')}
                className="hidden md:flex items-center gap-2 px-6 py-2.5 bg-[#333333] text-white rounded-md hover:bg-[#333333]/90 transition-colors shadow-sm"
              >
                <ClipboardList className="h-5 w-5" />
                <span className="font-medium">DEMANDE DE DEVIS</span>
              </button>
            </div>
          </div>

          <div className="md:hidden px-4 pb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Recherchez votre vêtement professionnel"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                className="w-full px-4 py-2 pl-10 border rounded-full focus:outline-none focus:ring-2 focus:ring-[#00A6E6]/20 focus:border-[#00A6E6] transition-all"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="hidden md:block border-t">
            <div className="container mx-auto px-4">
              <div className="flex items-center justify-between py-3 max-w-[1400px] mx-auto">
                <NavigationMenu className="-ml-12">
                  <NavigationMenuList>
                    {menuItems.map((item, index) => (
                      <CategoryLink 
                        key={index}
                        href={item.path}
                        topText={item.topText}
                        bottomText={item.bottomText}
                        subItems={item.subItems}
                      />
                    ))}
                  </NavigationMenuList>
                </NavigationMenu>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/personalization')}
                    className="px-6 py-2.5 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors text-sm font-medium flex items-center gap-2"
                  >
                    <span>Personalisation</span>
                  </button>
                  <button
                    onClick={() => navigate('/metiers')}
                    className="px-6 py-2.5 bg-[#FFD700] text-black rounded-md hover:bg-[#FFD700]/90 transition-colors text-sm font-medium shadow-sm flex items-center gap-2"
                  >
                    <span>MÉTIERS</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow" onClick={() => setShowSearchResults(false)}>
        <Outlet />
      </main>

      {/* WhatsApp Help Button */}
      <a
        href="https://wa.me/+33600000000"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed left-6 bottom-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        <MessageSquare className="h-5 w-5" />
        <span className="font-medium">Besoin d'aide ?</span>
      </a>

      {/* Social Media Links */}
      <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our Facebook page"
        >
          <Facebook className="h-5 w-5" />
        </a>
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our Instagram page"
        >
          <Instagram className="h-5 w-5" />
        </a>
        <a
          href="https://youtube.com"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Visit our YouTube channel"
        >
          <Youtube className="h-5 w-5" />
        </a>
      </div>

      <Footer />

      <Sheet open={isSubmenuOpen} onOpenChange={setIsSubmenuOpen}>
        <SheetContent side="left" className="w-full sm:w-[350px] p-0">
          {activeMenuItem && (
            <div className="flex flex-col h-full">
              <SheetHeader className="p-4 border-b">
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 -ml-2"
                  onClick={() => setIsSubmenuOpen(false)}
                >
                  <ArrowLeft className="h-5 w-5" />
                  <span>Retour</span>
                </Button>
                <SheetTitle className="mt-2">{activeMenuItem.title}</SheetTitle>
              </SheetHeader>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {activeMenuItem.subItems.map((subItem) => (
                  <div
                    key={subItem.path}
                    className="group cursor-pointer"
                    onClick={() => handleNavigation(subItem.path)}
                  >
                    <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-3">
                      <img 
                        src={subItem.image} 
                        alt={subItem.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-medium text-gray-900 group-hover:text-primary transition-colors">
                      {subItem.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {subItem.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default Layout;
