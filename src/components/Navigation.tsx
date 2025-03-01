import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { menuItems } from '../config/menuConfig';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedSubmenu, setSelectedSubmenu] = useState<string | null>(null);
  const [isSubmenuOpen, setIsSubmenuOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState<typeof menuItems[0] | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    setIsMobileMenuOpen(false);
    setIsSubmenuOpen(false);
    navigate(path);
  };

  const openSubmenu = (item: typeof menuItems[0]) => {
    setActiveMenuItem(item);
    setIsSubmenuOpen(true);
  };

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm py-4'
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </Button>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="-mx-1">
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuTrigger 
                      className={cn(
                        "text-gray-600 hover:text-primary transition-colors px-2",
                        location.pathname === item.path && "border-2 border-primary rounded-md bg-transparent text-primary"
                      )}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex flex-col items-start">
                        <span className="text-sm">{item.topText}</span>
                        <span className="text-xs">{item.bottomText}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-3 gap-3 p-4 w-[600px]">
                        {item.subItems.map((subItem) => (
                          <NavigationMenuLink
                            key={subItem.path}
                            className="block p-3 space-y-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                              <img 
                                src={subItem.image} 
                                alt={subItem.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium text-gray-900 text-sm">{subItem.title}</h3>
                            <p className="text-xs text-gray-500">{subItem.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

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

          {/* Mobile Menu */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetContent side="left" className="w-full sm:w-[350px] p-0">
              <div className="flex flex-col h-full">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto">
                  {menuItems.map((item) => (
                    <Button
                      key={item.path}
                      variant="ghost"
                      className={cn(
                        "justify-between w-full flex items-center py-6 px-4 border-b border-gray-100",
                        location.pathname === item.path && "border-2 border-primary text-primary rounded-md"
                      )}
                      onClick={() => openSubmenu(item)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{item.topText}</span>
                        <span>{item.bottomText}</span>
                      </div>
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  ))}
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Submenu Sheet */}
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
      </div>
    </nav>
  );
};
