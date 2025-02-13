
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const navigationItems = [
  {
    label: 'Produits',
    path: '/products',
    subItems: [
      {
        title: "Vêtements de Cuisine",
        description: "Collection professionnelle pour la restauration",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-cuisine"
      },
      {
        title: "Vêtements de Boucher",
        description: "Équipement spécialisé pour la boucherie",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-boucher"
      },
      {
        title: "Vêtements de Travail",
        description: "Tenues professionnelles polyvalentes",
        image: "/lovable-uploads/f0e25fb0-eac3-41ef-85f4-134f71438f42.png",
        path: "/vetements-travail"
      }
    ]
  },
  {
    label: 'Caractéristiques',
    path: '/features',
    subItems: [
      {
        title: "Matériaux Premium",
        description: "Qualité et durabilité garanties",
        image: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
        path: "/features/materials"
      },
      {
        title: "Sur Mesure",
        description: "Personnalisation complète",
        image: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
        path: "/features/custom"
      },
      {
        title: "Entretien Facile",
        description: "Vêtements pratiques au quotidien",
        image: "/lovable-uploads/98a68746-eff6-4ad1-b7d9-7fed922db14f.png",
        path: "/features/care"
      }
    ]
  },
  {
    label: 'À propos',
    path: '/about',
    subItems: [
      {
        title: "Notre Histoire",
        description: "Plus de 20 ans d'expertise",
        image: "/lovable-uploads/cdabb2a1-03dd-46f0-bda9-019861f8fb42.png",
        path: "/about/history"
      },
      {
        title: "Notre Équipe",
        description: "Des professionnels passionnés",
        image: "/lovable-uploads/cdabb2a1-03dd-46f0-bda9-019861f8fb42.png",
        path: "/about/team"
      },
      {
        title: "Nos Valeurs",
        description: "Engagement et qualité",
        image: "/lovable-uploads/cdabb2a1-03dd-46f0-bda9-019861f8fb42.png",
        path: "/about/values"
      }
    ]
  },
  {
    label: 'Contact',
    path: '/contact',
    subItems: [
      {
        title: "Service Client",
        description: "À votre écoute 6j/7",
        image: "/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png",
        path: "/contact/support"
      },
      {
        title: "Showroom",
        description: "Visitez notre espace d'exposition",
        image: "/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png",
        path: "/contact/showroom"
      },
      {
        title: "Partenariats",
        description: "Collaborons ensemble",
        image: "/lovable-uploads/c7046d56-7f03-4b6d-b599-ad3148741218.png",
        path: "/contact/partnerships"
      }
    ]
  }
];

export const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
                {navigationItems.map((item) => (
                  <NavigationMenuItem key={item.label}>
                    <NavigationMenuTrigger 
                      className={cn(
                        "text-gray-600 hover:text-primary transition-colors",
                        location.pathname.includes(item.path) && "text-primary"
                      )}
                    >
                      {item.label}
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

        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg shadow-lg animate-fade-in">
            <div className="flex flex-col space-y-4 p-6">
              {navigationItems.map((item) => (
                <div key={item.label} className="space-y-2">
                  <Button
                    variant="ghost"
                    className="justify-start w-full flex items-center"
                    onClick={() => handleNavigation(item.path)}
                  >
                    {item.label}
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                  <div className="pl-4 space-y-2">
                    {item.subItems.map((subItem) => (
                      <Button
                        key={subItem.path}
                        variant="ghost"
                        className="justify-start w-full text-sm"
                        onClick={() => handleNavigation(subItem.path)}
                      >
                        {subItem.title}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
