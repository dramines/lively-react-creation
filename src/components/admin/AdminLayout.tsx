
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  LogOut, 
  Menu,
  Home,
  Settings
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/admin');
  };

  const menuItems = [
    { icon: Home, label: 'Tableau de Bord', path: '/admin/dashboard' },
    { icon: ShoppingCart, label: 'Commandes', path: '/admin/orders' },
    { icon: Users, label: 'Clients', path: '/admin/clients' },
    { icon: BarChart3, label: 'Statistiques', path: '/admin/statistics' },
  ];

  const isActivePath = (path: string) => location.pathname === path;

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 lg:p-6 border-b border-orange-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-r from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
            <Settings className="h-4 w-4 lg:h-6 lg:w-6 text-white" />
          </div>
          <div>
            <h2 className="text-lg lg:text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">
              my little hero
            </h2>
            <Badge variant="secondary" className="mt-1 text-xs">
              Administrateur
            </Badge>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-3 lg:p-4 space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.path}
            variant={isActivePath(item.path) ? "default" : "ghost"}
            className={`w-full justify-start transition-all duration-200 text-sm lg:text-base ${
              isActivePath(item.path) 
                ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg" 
                : "hover:bg-orange-50 hover:text-orange-700"
            }`}
            onClick={() => {
              navigate(item.path);
              setIsSidebarOpen(false);
            }}
          >
            <item.icon className={`mr-2 lg:mr-3 h-4 w-4 ${
              isActivePath(item.path) ? "text-white" : "text-orange-500"
            }`} />
            <span className="truncate">{item.label}</span>
          </Button>
        ))}
      </nav>

      <div className="p-3 lg:p-4 border-t border-orange-200">
        <Button
          variant="outline"
          className="w-full justify-start border-orange-200 hover:bg-orange-50 text-sm lg:text-base"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 lg:mr-3 h-4 w-4 text-orange-500" />
          Déconnexion
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-pink-50">
      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 lg:hidden shadow-lg">
            <Menu className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 lg:w-80 bg-white shadow-2xl">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 xl:w-80 lg:flex-col">
        <div className="flex-1 bg-white shadow-2xl">
          <SidebarContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-72 xl:pl-80">
        <header className="bg-white/80 backdrop-blur-sm border-b border-orange-200 p-4 lg:p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="lg:hidden" />
            <div className="flex items-center space-x-2 lg:space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs lg:text-sm">
                🟢 En ligne
              </Badge>
              <div className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                Dernière mise à jour: {new Date().toLocaleTimeString('fr-FR')}
              </div>
            </div>
          </div>
        </header>
        
        <main className="p-4 lg:p-6 xl:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
