import React, { useState } from 'react';
import { X, ChevronRight, ArrowLeft, Instagram, Facebook, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import CurrencySelector from './CurrencySelector';
interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}
const MobileSidebar = ({
  isOpen,
  onClose
}: MobileSidebarProps) => {
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);
  const mainCategories = [{
    id: 'surMesure',
    title: 'Sur Mesure',
    description: 'Vêtements sur mesure personnalisés',
    subcategories: [{
      id: 'homme',
      title: 'Homme',
      items: [{
        key: 'blazers',
        label: 'Blazers'
      }, {
        key: 'blouson',
        label: 'Blousons'
      }, {
        key: 'manteau',
        label: 'Manteaux'
      }, {
        key: 'djine',
        label: 'Djine'
      }, {
        key: 'slack',
        label: 'Slack'
      }, {
        key: 'pantalon',
        label: 'Pantalons'
      }]
    }, {
      id: 'femme',
      title: 'Femme',
      items: [{
        key: 'chemise',
        label: 'Chemises'
      }, {
        key: 'costume',
        label: 'Costumes'
      }, {
        key: 'blazer',
        label: 'Blazers'
      }]
    }]
  }, {
    id: 'pretAPorter',
    title: 'Prêt à Porter',
    description: 'Collections prêtes à porter',
    subcategories: [{
      id: 'all',
      title: 'Tous les articles',
      items: [{
        key: 'chemise',
        label: 'Chemises'
      }, {
        key: 'tshirt',
        label: 'T-shirts'
      }, {
        key: 'polo',
        label: 'Polos'
      }, {
        key: 'chaussure',
        label: 'Chaussures'
      }, {
        key: 'ceinture',
        label: 'Ceintures'
      }, {
        key: 'maroquinerie',
        label: 'Maroquinerie'
      }]
    }]
  }, {
    id: 'accessoires',
    title: 'Accessoires',
    description: 'Accessoires de mode',
    subcategories: [{
      id: 'all',
      title: 'Tous les accessoires',
      items: [{
        key: 'cravate',
        label: 'Cravates'
      }, {
        key: 'pochette',
        label: 'Pochettes'
      }, {
        key: 'autre',
        label: 'Autres Accessoires'
      }]
    }]
  }];
  const handleCategoryClick = (category: string) => {
    setActiveSubMenu(category);
  };
  const handleSubMenuClose = () => {
    setActiveSubMenu(null);
  };
  const handleItemClick = () => {
    setActiveSubMenu(null);
    onClose();
  };
  const handleMainClose = () => {
    setActiveSubMenu(null);
    onClose();
  };
  const renderMainSidebar = () => <Sheet open={isOpen && !activeSubMenu} onOpenChange={handleMainClose}>
      <SheetContent side="right" className="w-80 p-0 bg-gradient-to-br from-slate-50 to-white border-l border-gray-200 [&>button]:hidden h-full flex flex-col overflow-hidden">
        {/* Header */}
        <SheetHeader className="bg-black text-white p-6 shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-center flex-1 mx-[71px] px-0 my-[-20px] mr-[18%] ml-[34%]">
              <img src="/lovable-uploads/ef1b651c-de8a-48ff-81e8-2d1b42e10df9.png" alt="Paola Di Battaglia" className="h-20 object-scale-down" />
            </div>
            <Button variant="ghost" size="sm" onClick={handleMainClose} className="text-white hover:bg-white/20 rounded-full h-10 w-10 p-0 transition-all duration-200">
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div className="px-4 py-4">
            {/* Main Navigation */}
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Collections
              </h3>
              
              {mainCategories.map(category => <button key={category.id} onClick={() => handleCategoryClick(category.id)} className="group flex items-center justify-between w-full p-3 bg-white hover:bg-gradient-to-r hover:from-gray-50 hover:to-gray-100 rounded-lg transition-all duration-300 border border-gray-100 hover:border-gray-200 hover:shadow-sm">
                  <div className="flex-1 text-left">
                    <span className="font-medium text-gray-900 text-sm block group-hover:text-gray-800 transition-colors">
                      {category.title}
                    </span>
                    <span className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors">
                      {category.description}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-all duration-200 group-hover:translate-x-1" />
                </button>)}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
            {/* Contact Us Section */}
            <div className="bg-white rounded-lg p-2 mb-3 border border-gray-200 shadow-sm">
              <div className="text-center">
                <h4 className="text-xs font-medium text-gray-800 mb-2">Contacter Nous</h4>
                <div className="flex justify-center space-x-3 mb-3">
                  <button className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                    <Phone className="w-3 h-3 text-gray-700 group-hover:text-black" />
                  </button>
                  <a href="#" className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                    <Instagram className="w-3 h-3 text-gray-700 group-hover:text-black" />
                  </a>
                  <a href="#" className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                    <Facebook className="w-3 h-3 text-gray-700 group-hover:text-black" />
                  </a>
                </div>
                <h4 className="text-xs font-medium text-gray-800 mb-2">Devise</h4>
                <div className="flex justify-center">
                  <CurrencySelector className="bg-gray-100 hover:bg-gray-200 rounded-lg" />
                </div>
              </div>
            </div>
            
            {/* Copyright */}
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">© 2024 Paola Di Battaglia</p>
              <p className="text-xs text-gray-400">Excellence & Élégance</p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
  const renderSubMenuSidebar = () => {
    if (!activeSubMenu) return null;
    const currentCategory = mainCategories.find(cat => cat.id === activeSubMenu);
    if (!currentCategory) return null;
    return <Sheet open={!!activeSubMenu} onOpenChange={open => !open && handleSubMenuClose()}>
        <SheetContent side="right" className="w-80 p-0 bg-gradient-to-br from-slate-50 to-white border-l border-gray-200 [&>button]:hidden h-full flex flex-col overflow-hidden">
          {/* Header */}
          <SheetHeader className="bg-black text-white p-4 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="sm" onClick={handleSubMenuClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <SheetTitle className="text-white text-base font-semibold">{currentCategory.title}</SheetTitle>
              <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>
          
          {/* Content */}
          <div className="flex-1 flex flex-col justify-between">
            <div className="px-4 py-3">
              <div className="space-y-3">
                {currentCategory.subcategories.map((subcategory, subIndex) => <div key={subIndex}>
                    {/* Subcategory Title */}
                    <div className="mb-2">
                      <h4 className="text-sm font-medium text-gray-900 px-3 py-2 bg-gradient-to-r from-gray-100 to-gray-50 rounded-md border border-gray-200">
                        {subcategory.title}
                      </h4>
                    </div>
                    
                    {/* Items */}
                    <div className="space-y-1 ml-1">
                      {subcategory.items.map((item, itemIndex) => <button key={itemIndex} onClick={handleItemClick} className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 rounded-md transition-all duration-200 border border-transparent hover:border-gray-200 hover:shadow-sm">
                          <span className="text-sm">{item.label}</span>
                        </button>)}
                    </div>
                    
                    {subIndex < currentCategory.subcategories.length - 1 && <Separator className="my-3 bg-gray-200" />}
                  </div>)}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 bg-gray-50/50 flex-shrink-0">
              {/* Contact Us Section */}
              <div className="bg-white rounded-lg p-2 mb-3 border border-gray-200 shadow-sm">
                <div className="text-center">
                  <h4 className="text-xs font-medium text-gray-800 mb-2">Contacter Nous</h4>
                  <div className="flex justify-center space-x-3 mb-3">
                    <button className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                      <Phone className="w-3 h-3 text-gray-700 group-hover:text-black" />
                    </button>
                    <a href="#" className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                      <Instagram className="w-3 h-3 text-gray-700 group-hover:text-black" />
                    </a>
                    <a href="#" className="flex items-center justify-center w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors group">
                      <Facebook className="w-3 h-3 text-gray-700 group-hover:text-black" />
                    </a>
                  </div>
                  <h4 className="text-xs font-medium text-gray-800 mb-2">Devise</h4>
                  <div className="flex justify-center">
                    <CurrencySelector className="bg-gray-100 hover:bg-gray-200 rounded-lg" />
                  </div>
                </div>
              </div>
              
              {/* Copyright */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">© 2024 Paola Di Battaglia</p>
                <p className="text-xs text-gray-400">Excellence & Élégance</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>;
  };
  return <>
      {renderMainSidebar()}
      {renderSubMenuSidebar()}
    </>;
};
export default MobileSidebar;