import React, { useState, useEffect } from 'react';
import { Menu, X, Instagram, Facebook, Phone, Mail, MapPin, Building2, Users, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { ClientType, NavItem, ProductCategory } from '../types';
import ProductsDropdown from './ProductsDropdown';
import LanguageSwitcher from './LanguageSwitcher';
import TikTokIcon from './icons/TikTokIcon';

interface NavbarProps {
  clientType: ClientType;
  currentPage: string;
  onPageChange: (page: string, category?: ProductCategory, subcategory?: string, productId?: string) => void;
  onClientTypeChange: (type: ClientType) => void;
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

interface SubMenuItem {
  label: string;
  href: string;
  category: string;
  subcategory?: string;
  translationKey: string;
  productId?: string;
  productId?: string;
}

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

const Navbar = ({ clientType, currentPage, onPageChange, onClientTypeChange }: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const { t } = useTranslation();
  
  const BASE_ITEMS: NavItem[] = [
    { label: t('navbar.home'), href: 'home' },
    { label: t('navbar.about'), href: 'about' },
    { label: t('navbar.quality'), href: 'certifications' },
  ];

  const B2C_ITEMS: NavItem[] = [
    ...BASE_ITEMS,
    { label: t('navbar.resellers'), href: 'resellers' },
    { label: t('navbar.consumer_service'), href: 'contact' }
  ];

  const B2B_ITEMS: NavItem[] = [
    ...BASE_ITEMS,
    { label: t('navbar.partners'), href: 'partners' },
    { label: t('navbar.contact'), href: 'contact' }
  ];
  
  const navItems = clientType === 'B2B' ? B2B_ITEMS : B2C_ITEMS;

  const isHomePage = currentPage === 'home' || currentPage === '';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href: string, e: React.MouseEvent, category?: ProductCategory, subcategory?: string, productId?: string) => {
    e.preventDefault();
    onPageChange(href, category, subcategory, productId);
    setIsOpen(false);
    setIsMobileProductsOpen(false);
  };

  const handleMobileMenuClick = (item: MenuItem, e: React.MouseEvent) => {
    e.preventDefault();
    if (item.directLink) {
      onPageChange(
        item.directLink.href, 
        item.directLink.category as ProductCategory, 
        undefined, 
        item.directLink.productId
      );
      setIsOpen(false);
      setIsMobileProductsOpen(false);
    } else {
      setIsMobileProductsOpen(!isMobileProductsOpen);
    }
  };

  const ClientTypeSwitcher = () => (
    <div className="flex items-center bg-white/5 rounded-full p-0.5 shadow-sm border border-white/10">
      <button
        onClick={() => onClientTypeChange('B2C')}
        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          clientType === 'B2C' 
            ? 'bg-[#96cc39]/90 text-white shadow-sm' 
            : 'text-white/80 hover:text-[#96cc39] hover:bg-white/5'
        }`}
      >
        <Users size={12} className="mr-1" />
        {t('client_types.b2c')}
      </button>
      <button
        onClick={() => onClientTypeChange('B2B')}
        className={`flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
          clientType === 'B2B' 
            ? 'bg-[#96cc39]/90 text-white shadow-sm' 
            : 'text-white/80 hover:text-[#96cc39] hover:bg-white/5'
        }`}
      >
        <Building2 size={12} className="mr-1" />
        {t('client_types.b2b')}
      </button>
    </div>
  );
  
  return (
    <header className={`w-full fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md' : 'bg-white/80 backdrop-blur-sm'
    }`}>
      <div className="bg-[#64381b] text-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-12">
            <div className="hidden lg:flex items-center space-x-6 mr-auto">
              <a href="tel:+21671385385" className="flex items-center space-x-2 text-sm hover:text-[#96cc39] transition-colors">
                <Phone size={14} />
                <span>{t('contact_info.phone')}</span>
              </a>
              <a href="mailto:contact@tazart.tn" className="flex items-center space-x-2 text-sm hover:text-[#96cc39] transition-colors">
                <Mail size={14} />
                <span>{t('contact_info.email')}</span>
              </a>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin size={14} />
                <span>9 rue de mercure, Ben Arous 2013</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <Instagram size={16} />
                </a>
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <Facebook size={16} />
                </a>
                <a href="#" className="hover:text-[#96cc39] transition-all duration-300 hover:scale-110">
                  <TikTokIcon size={16} />
                </a>
              </div>
              <div className="h-4 w-px bg-white/20" />
              <ClientTypeSwitcher />
              <div className="h-4 w-px bg-white/20" />
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden mr-4 w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#96cc39] hover:text-white transition-colors"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <a href="#" onClick={(e) => handleNavClick('home', e)} className="flex items-center ml-[-12%]">
              <img
                src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png"
                alt="Logo"
                className="h-[100px] w-auto"
              />
            </a>
          </div>

          <div className="hidden md:flex items-center">
            <div className="flex space-x-8">
              <a
                href="#"
                onClick={(e) => handleNavClick('home', e)}
                className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                  ${isHomePage ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
              >
                {t('navbar.home')}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                  ${isHomePage ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
              
              <a
                href="#"
                onClick={(e) => handleNavClick('about', e)}
                className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                  ${currentPage === 'about' ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
              >
                {t('navbar.about')}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                  ${currentPage === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
              
              <div className="flex items-center">
                <ProductsDropdown onPageChange={onPageChange} />
              </div>
              
              <a
                href="#"
                onClick={(e) => handleNavClick('certifications', e)}
                className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                  ${currentPage === 'certifications' ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
              >
                {t('navbar.quality')}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                  ${currentPage === 'certifications' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
              </a>
              
              {navItems.slice(3).map((item) => (
                <a
                  key={item.href}
                  href="#"
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`text-gray-700 transition-all duration-300 font-medium relative group py-2
                    ${currentPage === item.href ? 'text-[#96cc39]' : 'hover:text-[#96cc39]'}`}
                >
                  {item.label}
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#96cc39] transform transition-transform origin-left
                    ${currentPage === item.href ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`} />
                </a>
              ))}
            </div>
          </div>
        </nav>

        <div 
          className={`fixed inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ${
            isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
          } z-40`}
          onClick={() => setIsOpen(false)}
        />
        <div
          className={`fixed top-0 left-0 h-screen w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out z-50 overflow-y-auto ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="p-6 flex flex-col h-full">
            <div className="flex justify-between items-center mb-8">
              <img
                src="https://i.ibb.co/KxkCnFLR/logo-tazart-page-0001-removebg-preview.png"
                alt="Logo"
                className="h-12 w-auto"
              />
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-700 hover:bg-[#96cc39] hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-4">
              <a
                href="#"
                onClick={(e) => handleNavClick('home', e)}
                className={`block text-lg font-medium transition-colors
                  ${isHomePage ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
              >
                {t('navbar.home')}
              </a>

              <a
                href="#"
                onClick={(e) => handleNavClick('about', e)}
                className={`block text-lg font-medium transition-colors
                  ${currentPage === 'about' ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
              >
                {t('navbar.about')}
              </a>
              
              <div className="relative">
                <button
                  onClick={() => setIsMobileProductsOpen(!isMobileProductsOpen)}
                  className="flex items-center justify-between w-full text-lg font-medium text-gray-700 hover:text-[#96cc39] transition-colors"
                >
                  {t('navbar.products')}
                  <ChevronDown 
                    className={`w-5 h-5 transition-transform ${isMobileProductsOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                
                {isMobileProductsOpen && (
                  <div className="mt-2 ml-4 space-y-4">
                    {MENU_ITEMS.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <a
                          href="#"
                          onClick={(e) => handleMobileMenuClick(item, e)}
                          className="block font-medium text-gray-700 hover:text-[#96cc39] transition-colors"
                        >
                          {t(item.translationKey)}
                        </a>
                        
                        {item.items && (
                          <div className="pl-4 space-y-2 mt-2">
                            {item.items.map((subItem, subIndex) => (
                              <a
                                key={subIndex}
                                href="#"
                                onClick={(e) => {
                                  e.preventDefault();
                                  onPageChange(
                                    subItem.href, 
                                    subItem.category as ProductCategory, 
                                    subItem.subcategory, 
                                    subItem.productId
                                  );
                                  setIsOpen(false);
                                }}
                                className="block text-gray-600 hover:text-[#96cc39] transition-colors"
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
              
              <a
                href="#"
                onClick={(e) => handleNavClick('certifications', e)}
                className={`block text-lg font-medium transition-colors
                  ${currentPage === 'certifications' ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
              >
                {t('navbar.quality')}
              </a>

              {navItems.slice(3).map((item) => (
                <a
                  key={item.href}
                  href="#"
                  onClick={(e) => handleNavClick(item.href, e)}
                  className={`block text-lg font-medium transition-colors
                    ${currentPage === item.href ? 'text-[#96cc39]' : 'text-gray-700 hover:text-[#96cc39]'}`}
                >
                  {item.label}
                </a>
              ))}
            </div>

            <div className="mt-auto">
              <div className="space-y-4 mb-6">
                <a href="tel:+21671385385" className="flex items-center space-x-3 text-gray-600 hover:text-[#96cc39] transition-colors">
                  <Phone size={18} />
                  <span>+216 71 385 385</span>
                </a>
                <a href="mailto:contact@tazart.tn" className="flex items-center space-x-3 text-gray-600 hover:text-[#96cc39] transition-colors">
                  <Mail size={18} />
                  <span>contact@tazart.tn</span>
                </a>
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin size={18} />
                  <span>9 rue de mercure, Ben Arous 2013</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <a href="https://www.instagram.com/tazart.lessaveursduterroir" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <Instagram size={18} />
                </a>
                <a href="https://www.facebook.com/share/15CMhRGoUM/?mibextid=wwXIfr" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <Facebook size={18} />
                </a>
                <a href="https://www.tiktok.com/@tazarttunisie?_t=ZS-8uOsLDKyctT&_r=1" className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-[#96cc39] hover:text-white transition-colors">
                  <TikTokIcon size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
