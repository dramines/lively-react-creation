
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Mail, 
  BarChart3, 
  Menu, 
  X,
  LogOut,
  Calendar,
  MessageSquare,
  ShoppingBag
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    {
      name: 'Tableau de bord',
      href: '/admin/dashboard',
      icon: LayoutDashboard,
    },
    {
      name: 'Produits',
      href: '/admin/products',
      icon: ShoppingBag,
    },
    {
      name: 'Commandes',
      href: '/admin/orders',
      icon: Package,
    },
    {
      name: 'Clients',
      href: '/admin/clients',
      icon: Users,
    },
    {
      name: 'Réservations',
      href: '/admin/reservations',
      icon: Calendar,
    },
    {
      name: 'Messages',
      href: '/admin/messages',
      icon: MessageSquare,
    },
    {
      name: 'Newsletter',
      href: '/admin/newsletter',
      icon: Mail,
    },
    {
      name: 'Visiteurs',
      href: '/admin/visitors',
      icon: BarChart3,
    },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-all duration-300 ease-in-out border-r border-gray-200 h-screen flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:flex lg:flex-col
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between h-20 px-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-b border-gray-700 flex-shrink-0">
          <div className="flex items-center justify-center w-full">
            <img 
              src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
              alt="LUCCI BY E.Y" 
              className="h-12 object-contain"
            />
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden text-white hover:bg-gray-700 rounded-lg ml-2"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-6">
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`
                    group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200
                    ${isActivePath(item.href)
                      ? 'bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg transform scale-[1.02]'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md'
                    }
                  `}
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <Icon className={`mr-3 h-5 w-5 transition-colors ${
                    isActivePath(item.href) ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'
                  }`} />
                  <span className="font-medium">{item.name}</span>
                  {isActivePath(item.href) && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>
                  )}
                </Link>
              );
            })}
          </nav>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-4 flex-shrink-0">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-600 hover:bg-red-50 rounded-xl py-3"
          >
            <LogOut className="mr-3 h-4 w-4" />
            <span className="font-medium">Déconnexion</span>
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:ml-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden bg-white shadow-sm border-b px-4 py-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSidebarOpen(true)}
              className="text-gray-700 hover:bg-gray-100 rounded-lg p-2"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <img 
                src="/lovable-uploads/136aa729-e26b-4832-9cbb-97b861235f24.png" 
                alt="LUCCI BY E.Y" 
                className="h-8 object-contain"
              />
            </div>
            <div className="w-10" />
          </div>
        </div>

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </ScrollArea>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
