
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  LayoutDashboard,
  ShoppingCart, 
  Eye, 
  DollarSign,
  Clock,
  BarChart3,
  RefreshCw,
  TrendingUp,
  Calendar,
  Monitor,
  Smartphone,
  Tablet,
  User,
  Package
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, PieChart, Pie, Cell } from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface Product {
  id_product: number;
  nom_product: string;
  reference_product: string;
  stock_product: number;
  prix_product: number;
}

interface Order {
  id_order: number;
  numero_commande: string;
  total_order: number;
  status_order: string;
  payment_status: string;
  date_creation_order: string;
  nom_customer: string;
  prenom_customer: string;
}

interface Reservation {
  id_reservation: number;
  nom_client: string;
  date_reservation: string;
  statut_reservation: string;
  date_creation: string;
}

interface VisitorStats {
  visitorsToday: number;
  pageviewsToday: number;
  bounceRate: number;
  dailyVisitors: Array<{
    date: string;
    visitors: number;
    pageviews: number;
  }>;
}

const fetchProducts = async (): Promise<Product[]> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_all_products.php?limit=1000');
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

const fetchOrders = async (): Promise<Order[]> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_all_orders.php');
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

const fetchVisitorStats = async (): Promise<VisitorStats> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_visitor_stats.php');
  if (!response.data.success) throw new Error(response.data.message);
  return response.data.data;
};

const AdminDashboard = () => {
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchOrders,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const { data: visitorStats, isLoading: visitorsLoading, refetch } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: fetchVisitorStats,
    refetchInterval: 60000,
    staleTime: 30 * 1000, // 30 seconds
  });

  const isLoading = productsLoading || ordersLoading || visitorsLoading;

  // Calculate stats from fetched data
  const stats = {
    ordersToday: orders?.filter(o => {
      const orderDate = new Date(o.date_creation_order);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).length || 0,
    ordersTotal: orders?.length || 0,
    revenueToday: orders?.filter(o => {
      const orderDate = new Date(o.date_creation_order);
      const today = new Date();
      return orderDate.toDateString() === today.toDateString();
    }).reduce((sum, o) => sum + parseFloat(o.total_order.toString()), 0) || 0,
    revenueTotal: orders?.reduce((sum, o) => sum + parseFloat(o.total_order.toString()), 0) || 0,
  };

  // Get recent orders (last 5)
  const recentOrders = orders?.slice(0, 5).map(order => ({
    ...order,
    customer_name: `${order.nom_customer} ${order.prenom_customer}`
  })) || [];

  // Calculate revenue for last 6 months
  const chartData = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const monthName = date.toLocaleDateString('fr-FR', { month: 'short' });
    
    const monthOrders = orders?.filter(o => {
      const orderDate = new Date(o.date_creation_order);
      return orderDate.getMonth() === date.getMonth() && orderDate.getFullYear() === date.getFullYear();
    }) || [];
    
    const monthRevenue = monthOrders.reduce((sum, o) => sum + parseFloat(o.total_order.toString()), 0);
    
    chartData.push({
      name: monthName,
      orders: monthOrders.length,
      revenue: monthRevenue,
      visitors: Math.floor(Math.random() * 1000) + 500
    });
  }

  // Device stats from visitor data
  const deviceStats = visitorStats?.deviceData || [
    { name: 'Mobile', value: 65, color: '#3b82f6', icon: Smartphone },
    { name: 'Desktop', value: 30, color: '#10b981', icon: Monitor },
    { name: 'Tablette', value: 5, color: '#8b5cf6', icon: Tablet }
  ];

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'En traitement', variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      shipped: { label: 'Expédiée', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      delivered: { label: 'Livrée', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>;
  };

  const getPaymentBadge = (status: string) => {
    const statusMap = {
      paid: { label: 'Payé', color: 'bg-green-100 text-green-800' },
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      failed: { label: 'Échoué', color: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { label: status, color: 'bg-gray-100 text-gray-800' };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>{statusInfo.label}</span>;
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="animate-spin h-12 w-12 text-gray-900 mx-auto mb-4" />
            <p className="text-gray-600">Chargement des statistiques...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
        {/* Header */}
        <div className="bg-white shadow-sm border-b">
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 flex items-center">
                  <LayoutDashboard className="mr-2 sm:mr-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                  Tableau de Bord
                </h1>
                <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                  Vue d'ensemble de votre boutique LUCCI BY E.Y
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="text-right hidden sm:block">
                  <div className="text-sm text-gray-500">Dernière mise à jour</div>
                  <div className="font-medium text-gray-900">
                    {new Date().toLocaleDateString('fr-FR')} à {new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
                <Button variant="outline" onClick={() => refetch()} size="sm" className="hover:bg-gray-100">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  <span className="hidden sm:inline">Actualiser</span>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 shadow-md bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-emerald-900 flex items-center justify-between">
                  <span>CA Total</span>
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-900 mb-1">
                  {stats.revenueTotal.toFixed(0)} TND
                </div>
                <div className="flex items-center text-xs text-emerald-700">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Chiffre d'affaires total</span>
                  <span className="sm:hidden">Total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-blue-900 flex items-center justify-between">
                  <span>CA Aujourd'hui</span>
                  <DollarSign className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-blue-900 mb-1">
                  {stats.revenueToday.toFixed(0)} TND
                </div>
                <div className="flex items-center text-xs text-blue-700">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Revenus d'aujourd'hui</span>
                  <span className="sm:hidden">Aujourd'hui</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-green-50 to-green-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-green-900 flex items-center justify-between">
                  <span>Commandes Total</span>
                  <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-900 mb-1">
                  {stats.ordersTotal.toLocaleString('fr-FR')}
                </div>
                <div className="flex items-center text-xs text-green-700">
                  <Package className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Total des commandes</span>
                  <span className="sm:hidden">Total</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <CardHeader className="pb-2 sm:pb-3">
                <CardTitle className="text-xs sm:text-sm font-medium text-purple-900 flex items-center justify-between">
                  <span>Visiteurs Aujourd'hui</span>
                  <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-purple-900 mb-1">
                  {visitorStats?.visitorsToday || 0}
                </div>
                <div className="flex items-center text-xs text-purple-700">
                  <User className="h-3 w-3 mr-1" />
                  <span className="hidden sm:inline">Visiteurs uniques</span>
                  <span className="sm:hidden">Uniques</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Device Stats Section */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Evolution Chart */}
            <Card className="lg:col-span-2 border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="font-playfair text-gray-900 flex items-center text-lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Évolution du Chiffre d'Affaires
                </CardTitle>
                <CardDescription>Revenus des 6 derniers mois (TND)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 sm:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" fontSize={12} stroke="#64748b" />
                      <YAxis fontSize={12} stroke="#64748b" />
                      <Tooltip 
                        formatter={(value) => [`${value} TND`, 'Revenus']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="revenue" 
                        stroke="#10b981" 
                        strokeWidth={2}
                        fillOpacity={1} 
                        fill="url(#revenueGradient)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Device Stats */}
            <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="font-playfair text-gray-900 flex items-center text-lg">
                  <Monitor className="mr-2 h-5 w-5" />
                  Appareils Utilisés
                </CardTitle>
                <CardDescription>Répartition par type d'appareil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {deviceStats.map((device, index) => {
                    const IconComponent = device.icon || Monitor;
                    return (
                      <div key={device.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <div className="flex items-center space-x-3">
                          <div className="p-2 rounded-lg" style={{ backgroundColor: device.color + '20' }}>
                            <IconComponent className="h-4 w-4" style={{ color: device.color }} />
                          </div>
                          <span className="font-medium text-gray-900">{device.name}</span>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-gray-900">{device.value}%</div>
                          <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
                            <div 
                              className="h-2 rounded-full transition-all duration-500" 
                              style={{ 
                                width: `${device.value}%`, 
                                backgroundColor: device.color 
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="font-playfair text-gray-900 flex items-center text-lg">
                <Clock className="mr-2 h-5 w-5" />
                Commandes Récentes
              </CardTitle>
              <CardDescription>Dernières commandes reçues</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentOrders.length ? (
                  recentOrders.map((order) => (
                    <div key={order.id_order} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl hover:from-gray-100 hover:to-gray-200 transition-all duration-300 border border-gray-200 shadow-sm hover:shadow-md">
                      <div className="flex items-center space-x-4 flex-1 min-w-0 mb-3 sm:mb-0">
                        <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex-shrink-0 shadow-sm"></div>
                        <div className="min-w-0 flex-1">
                          <div className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                            {order.customer_name}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Commande #{order.numero_commande}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(order.date_creation_order).toLocaleDateString('fr-FR')} à{' '}
                            {new Date(order.date_creation_order).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4 flex-shrink-0">
                        <div className="text-left sm:text-right">
                          <div className="font-bold text-gray-900 text-sm sm:text-base">
                            {parseFloat(order.total_order.toString()).toFixed(2)} TND
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {getStatusBadge(order.status_order)}
                          {getPaymentBadge(order.payment_status)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">Aucune commande récente</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
