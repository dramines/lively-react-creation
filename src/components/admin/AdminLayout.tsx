
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { LogOut, Menu } from 'lucide-react';
import {
  SidebarProvider,
  SidebarTrigger,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  ShoppingCart, 
  MessageSquare, 
  Mail,
  BarChart3
} from 'lucide-react';

const adminMenuItems = [
  { title: 'Tableau de bord', url: '/admin/dashboard', icon: LayoutDashboard, color: 'text-blue-600' },
  { title: 'Produits', url: '/admin/products', icon: Package, color: 'text-green-600' },
  { title: 'Commandes', url: '/admin/orders', icon: ShoppingCart, color: 'text-orange-600' },
  { title: 'Clients', url: '/admin/customers', icon: Users, color: 'text-purple-600' },
  { title: 'Messages', url: '/admin/messages', icon: MessageSquare, color: 'text-red-600' },
  { title: 'Newsletter', url: '/admin/newsletter', icon: Mail, color: 'text-pink-600' },
  { title: 'Visiteurs', url: '/admin/visitors', icon: BarChart3, color: 'text-indigo-600' },
];

const AdminSidebar = () => {
  const { logout } = useAdminAuth();

  return (
    <Sidebar className="bg-white border-r border-gray-200 shadow-sm">
      <SidebarContent>
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-center">
            <img 
              src="/lovable-uploads/04272c72-7979-4c68-9c37-efc9954ca58f.png" 
              alt="LUCCI BY E.Y" 
              className="h-12 object-contain"
            />
          </div>
          <p className="text-center text-sm text-gray-500 mt-2 font-medium">Administration</p>
        </div>
        
        <SidebarGroup className="px-4 py-6">
          <SidebarGroupLabel className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {adminMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="group h-12">
                    <NavLink 
                      to={item.url} 
                      className={({ isActive }) => 
                        `flex items-center space-x-3 px-4 py-4 rounded-lg transition-all duration-200 h-12 ${
                          isActive 
                            ? 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 shadow-sm border-l-4 border-blue-600' 
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`
                      }
                    >
                      {({ isActive }) => (
                        <>
                          <item.icon className={`h-5 w-5 ${isActive ? 'text-blue-600' : item.color} transition-colors`} />
                          <span className="font-medium">{item.title}</span>
                        </>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Logout Section */}
        <div className="mt-auto p-4 border-t border-gray-100">
          <Button 
            onClick={logout} 
            variant="outline" 
            className="w-full flex items-center space-x-2 text-gray-600 hover:text-red-600 hover:bg-red-50 hover:border-red-200 transition-all duration-200 h-12"
          >
            <LogOut className="h-4 w-4" />
            <span>Déconnexion</span>
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

const AdminLayout = () => {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <header className="h-16 bg-white border-b border-gray-200 flex items-center px-6 shadow-sm">
            <SidebarTrigger className="mr-4 text-gray-600 hover:text-gray-900" />
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">Administration</h1>
              <div className="h-6 w-px bg-gray-300"></div>
              <span className="text-sm text-gray-500">Gestion de votre boutique</span>
            </div>
          </header>
          <main className="flex-1 p-6 bg-gray-50 overflow-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
