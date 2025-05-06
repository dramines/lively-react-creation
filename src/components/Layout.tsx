
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import Footer from "./Footer";
import CookieConsent from "./CookieConsent";
import { menuItems } from '../config/menuConfig';
import SearchBar from './navigation/SearchBar';
import HeaderActions from './navigation/HeaderActions';
import DesktopNavigation from './navigation/DesktopNavigation';
import MobileMenu from './navigation/MobileMenu';
import PromoBar from './navigation/PromoBar';
import SocialButtons from './navigation/SocialButtons';

export const Layout = () => {
  const [cartCount, setCartCount] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeMenuItem, setActiveMenuItem] = useState<typeof menuItems[0] | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleNavigation = (path: string) => {
    setIsSubmenuOpen(false);
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />

      <nav className="w-full bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto">
          <div className="flex items-center justify-between py-4 px-4">
            <MobileMenu 
              menuItems={menuItems}
              activeMenuItem={activeMenuItem}
              setActiveMenuItem={setActiveMenuItem}
              isSubmenuOpen={isSubmenuOpen}
              setIsSubmenuOpen={setIsSubmenuOpen}
              handleNavigation={handleNavigation}
            />

            <Link to="/" className="flex-shrink-0">
              <img src="/logo.png" alt="ELLES" className="h-14" />
            </Link>

            <SearchBar />

            <HeaderActions 
              favoritesCount={favorites.length}
              cartCount={cartCount}
            />
          </div>

          <div className="md:hidden px-4 pb-4">
            <SearchBar mobile={true} />
          </div>

          <DesktopNavigation />
        </div>
      </nav>

      <main className="flex-grow" onClick={() => {}}>
        <Outlet />
      </main>

      <SocialButtons />

      <Footer />
      
      <CookieConsent />
    </div>
  );
};

export default Layout;
