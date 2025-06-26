
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, ChevronRight, Heart, MapPin, Instagram, Facebook, MessageCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onStoreFinderOpen?: () => void;
  onBookingOpen?: () => void;
  onWishlistOpen?: () => void;
  onContactOpen?: () => void;
}

const MobileSidebar = ({ isOpen, onClose, onStoreFinderOpen, onBookingOpen, onWishlistOpen, onContactOpen }: MobileSidebarProps) => {
  const { t } = useTranslation();
  const { t: tProducts } = useTranslation('products');
  const [activeSubMenu, setActiveSubMenu] = useState<string | null>(null);

  const utilityItems = [
    { 
      icon: Heart, 
      label: 'Liste de souhaits',
      description: 'Vos articles favoris',
      onClick: () => {
        onClose();
        onWishlistOpen?.();
      }
    },
    { 
      icon: MapPin, 
      label: 'Rdv sur mesure',
      description: 'Réservez votre mesure privée',
      onClick: () => {
        onClose();
        onBookingOpen?.();
      }
    },
  ];

  const socialMediaItems = [
    {
      icon: Instagram,
      label: 'Instagram',
      url: 'https://www.instagram.com/luccibyey/?hl=en'
    },
    {
      icon: Facebook,
      label: 'Facebook', 
      url: 'https://www.facebook.com/luccibyey.net/'
    }
  ];

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

  const renderMainSidebar = () => (
    <Sheet open={isOpen && !activeSubMenu} onOpenChange={handleMainClose}>
      <SheetContent side="left" className="w-80 p-0 bg-black/60 backdrop-blur-xl border-r border-gray-700 [&>button]:hidden h-full flex flex-col">
        {/* Header */}
        <SheetHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <img 
                src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                alt="LUCCI BY E.Y" 
                className="h-10 object-contain opacity-90"
              />
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleMainClose} 
              className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0 transition-all duration-200"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-4">
            {/* Main Navigation */}
            <div className="space-y-0 mb-6">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-3 px-2">
                Collections
              </h3>
              
              {/* Sur Mesure */}
              <button
                onClick={() => handleCategoryClick('surMesure')}
                className="group flex items-center justify-between w-full p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
              >
                <span className="font-medium text-sm group-hover:text-blue-200 transition-colors">
                  {tProducts('categories.surMesure')}
                </span>
                <ChevronRight className="w-3 h-3 text-white/60 group-hover:text-blue-200 transition-all duration-200" />
              </button>

              {/* Prêt à Porter */}
              <button
                onClick={() => handleCategoryClick('pretAPorter')}
                className="group flex items-center justify-between w-full p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
              >
                <span className="font-medium text-sm group-hover:text-blue-200 transition-colors">
                  {tProducts('categories.pretAPorter')}
                </span>
                <ChevronRight className="w-3 h-3 text-white/60 group-hover:text-blue-200 transition-all duration-200" />
              </button>

              {/* Accessoires */}
              <button
                onClick={() => handleCategoryClick('accessoires')}
                className="group flex items-center justify-between w-full p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
              >
                <span className="font-medium text-sm group-hover:text-blue-200 transition-colors">
                  {tProducts('categories.accessoires')}
                </span>
                <ChevronRight className="w-3 h-3 text-white/60 group-hover:text-blue-200 transition-all duration-200" />
              </button>
            </div>

            <Separator className="my-3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Services Section */}
            <div className="space-y-0">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                Services
              </h3>
              {utilityItems.map((item, index) => (
                <a
                  key={index}
                  href="#"
                  className="group flex items-center p-2 text-white hover:bg-gradient-to-r hover:from-blue-600/20 hover:to-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
                  onClick={item.onClick || handleMainClose}
                >
                  <div className="flex items-center justify-center w-6 h-6 bg-white/10 group-hover:bg-blue-500/20 rounded-lg mr-3 transition-colors duration-200">
                    <item.icon className="w-3 h-3 text-white/80 group-hover:text-blue-200 transition-colors duration-200" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-sm block group-hover:text-blue-200 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-xs text-white/60 group-hover:text-blue-300/80 transition-colors">
                      {item.description}
                    </span>
                  </div>
                </a>
              ))}
            </div>

            <Separator className="my-3 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

            {/* Social Media Section */}
            <div className="space-y-0">
              <h3 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2 px-2">
                Suivez-nous
              </h3>
              <div className="flex space-x-2 px-2">
                {socialMediaItems.map((item, index) => (
                  <a
                    key={index}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-center w-10 h-10 bg-white/10 hover:bg-blue-500/20 rounded-lg transition-all duration-200 border border-transparent hover:border-blue-400/20"
                  >
                    <item.icon className="w-4 h-4 text-white/80 group-hover:text-blue-200 transition-colors duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
          <div className="text-center">
            <p className="text-xs text-white/60 mb-1">© 2024 LUCCI BY E.Y</p>
            <p className="text-xs text-white/40">Excellence & Élégance</p>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );

  const renderSubMenuSidebar = () => {
    if (!activeSubMenu) return null;

    let title = '';
    let items: Array<{ key: string; value: string }> = [];

    switch (activeSubMenu) {
      case 'surMesure':
        title = tProducts('categories.surMesure');
        const surMesureData = tProducts('surMesure', { returnObjects: true }) as any;
        items = [
          { key: 'homme-title', value: surMesureData.homme.title },
          ...Object.entries(surMesureData.homme)
            .filter(([key]) => key !== 'title')
            .map(([key, value]) => ({ key: `homme-${key}`, value: value as string })),
          { key: 'femme-title', value: surMesureData.femme.title },
          ...Object.entries(surMesureData.femme)
            .filter(([key]) => key !== 'title')
            .map(([key, value]) => ({ key: `femme-${key}`, value: value as string }))
        ];
        break;
      case 'pretAPorter':
        title = tProducts('categories.pretAPorter');
        items = Object.entries(tProducts('pretAPorter', { returnObjects: true }) as Record<string, string>)
          .map(([key, value]) => ({ key, value }));
        break;
      case 'accessoires':
        title = tProducts('categories.accessoires');
        items = Object.entries(tProducts('accessoires', { returnObjects: true }) as Record<string, string>)
          .map(([key, value]) => ({ key, value }));
        break;
    }

    return (
      <Sheet open={!!activeSubMenu} onOpenChange={(open) => !open && handleSubMenuClose()}>
        <SheetContent side="left" className="w-80 p-0 bg-black/70 backdrop-blur-xl border-r border-gray-700 [&>button]:hidden h-full flex flex-col">
          {/* Header */}
          <SheetHeader className="bg-gradient-to-r from-blue-900 to-blue-800 text-white p-4 shadow-lg flex-shrink-0">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSubMenuClose}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <SheetTitle className="text-white text-lg font-semibold">{title}</SheetTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </SheetHeader>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-3">
            <div className="space-y-0">
              {items.map((item, index) => {
                const isTitle = item.key.endsWith('-title');
                return (
                  <div key={index}>
                    {isTitle ? (
                      <div className="mb-1 mt-3 first:mt-1">
                        <h4 className="text-base font-semibold text-blue-200 px-3 py-2 border-l-3 border-blue-400 bg-blue-900/20 rounded-r-md">
                          {item.value}
                        </h4>
                      </div>
                    ) : (
                      <button
                        onClick={handleItemClick}
                        className="w-full text-left px-4 py-2 text-white/90 hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-blue-500/30 rounded-md transition-all duration-200 border border-transparent hover:border-blue-400/20 ml-2"
                      >
                        <span className="text-sm font-medium">{item.value}</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/10 bg-black/20 flex-shrink-0">
            <div className="text-center">
              <p className="text-xs text-white/60 mb-1">© 2024 LUCCI BY E.Y</p>
              <p className="text-xs text-white/40">Excellence & Élégance</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <>
      {renderMainSidebar()}
      {renderSubMenuSidebar()}
    </>
  );
};

export default MobileSidebar;
