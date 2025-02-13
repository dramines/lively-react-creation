
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react';
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

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubMenus, setOpenSubMenus] = useState<string[]>([]);
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
    navigate(path);
  };

  const toggleSubMenu = (path: string) => {
    setOpenSubMenus(prev => 
      prev.includes(path) 
        ? prev.filter(item => item !== path)
        : [...prev, path]
    );
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
      <div className="container mx-auto px-6">
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

          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList>
                {menuItems.map((item) => (
                  <NavigationMenuItem key={item.path}>
                    <NavigationMenuTrigger 
                      className={cn(
                        "text-gray-600 hover:text-primary transition-colors",
                        location.pathname === item.path && "border-2 border-primary rounded-md bg-transparent text-primary"
                      )}
                      onClick={() => handleNavigation(item.path)}
                    >
                      <div className="flex flex-col items-start">
                        <span>{item.topText}</span>
                        <span>{item.bottomText}</span>
                      </div>
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="grid grid-cols-3 gap-4 p-6 w-[600px]">
                        {item.subItems.map((subItem) => (
                          <NavigationMenuLink
                            key={subItem.path}
                            className="block p-4 space-y-2 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer"
                            onClick={() => handleNavigation(subItem.path)}
                          >
                            <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 mb-2">
                              <img 
                                src={subItem.image} 
                                alt={subItem.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="font-medium text-gray-900">{subItem.title}</h3>
                            <p className="text-sm text-gray-500">{subItem.description}</p>
                          </NavigationMenuLink>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-1 p-4">
              {menuItems.map((item) => (
                <div key={item.path} className="border-b border-gray-100 last:border-0">
                  <Button
                    variant="ghost"
                    className={cn(
                      "justify-between w-full flex items-center py-3",
                      location.pathname === item.path && "border-2 border-primary text-primary rounded-md"
                    )}
                    onClick={() => toggleSubMenu(item.path)}
                  >
                    <div className="flex flex-col items-start">
                      <span>{item.topText}</span>
                      <span>{item.bottomText}</span>
                    </div>
                    <ChevronDown 
                      className={cn(
                        "ml-2 h-4 w-4 transition-transform",
                        openSubMenus.includes(item.path) && "transform rotate-180"
                      )} 
                    />
                  </Button>
                  
                  {openSubMenus.includes(item.path) && (
                    <div className="pl-4 py-2 space-y-2">
                      {item.subItems.map((subItem) => (
                        <Button
                          key={subItem.path}
                          variant="ghost"
                          className="w-full justify-start text-sm py-2"
                          onClick={() => handleNavigation(subItem.path)}
                        >
                          <div className="flex items-center w-full">
                            <div className="w-12 h-12 rounded-lg overflow-hidden mr-3">
                              <img 
                                src={subItem.image} 
                                alt={subItem.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium">{subItem.title}</p>
                              <p className="text-xs text-gray-500">{subItem.description}</p>
                            </div>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                          </div>
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
