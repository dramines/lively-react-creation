
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { 
  Users, 
  Package, 
  TrendingUp, 
  Calendar, 
  Eye, 
  MessageSquare, 
  Mail, 
  UserCheck,
  Euro,
  ShoppingCart,
  BarChart3,
  Clock,
  Globe,
  Smartphone,
  Monitor,
  Tablet
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';

interface DashboardStats {
  total_revenue: number;
  today_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_visitors: number;
  today_visitors: number;
  device_analytics: Array<{
    device_type: string;
    visitors: number;
  }>;
  visitor_growth: Array<{
    date: string;
    visitors: number;
  }>;
  revenue_growth: Array<{
    date: string;
    revenue: number;
  }>;
  top_countries: Array<{
    country: string;
    visitors: number;
  }>;
  latest_orders: Array<{
    id_order: number;
    numero_commande: string;
    total_order: number;
    status_order: string;
    date_creation_order: string;
    nom_customer: string;
    prenom_customer: string;
  }>;
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_dashboard_stats.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch dashboard stats');
  }
  return response.data.data;
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  const { data: stats, isLoading, error } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000,
  });

  const safeToFixed = (value: any, decimals: number = 2): string => {
    if (value === null || value === undefined || value === '') {
      return '0.00';
    }
    
    const stringValue = String(value).trim();
    const num = parseFloat(stringValue);
    
    if (isNaN(num)) {
      console.warn('safeToFixed: Invalid numeric value:', value);
      return '0.00';
    }
    
    return num.toFixed(decimals);
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      processing: { label: 'En traitement', variant: 'default' as const, color: 'bg-purple-100 text-purple-800' },
      shipped: { label: 'Expédiée', variant: 'default' as const, color: 'bg-orange-100 text-orange-800' },
      delivered: { label: 'Livrée', variant: 'default' as const, color: 'bg-green-100 text-green-800' }
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      variant: 'secondary' as const, 
      color: 'bg-gray-100 text-gray-800' 
    };
    
    return (
      <Badge variant={statusInfo.variant} className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  const handleOrderClick = (orderId: number) => {
    navigate(`/admin/orders?order=${orderId}`);
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType.toLowerCase()) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'tablet':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du tableau de bord...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600">Erreur lors du chargement des données</p>
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
          <div className="px-4 sm:px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-playfair font-bold text-gray-900 flex items-center">
                  <TrendingUp className="mr-3 h-6 w-6 sm:h-8 sm:w-8 text-gray-700" />
                  Tableau de Bord
                </h1>
                <p className="text-gray-600 mt-2 text-sm sm:text-base">
                  Vue d'ensemble de votre boutique LUCCI BY E.Y
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Chiffre d'Affaires Total</CardTitle>
                <Euro className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{safeToFixed(stats?.total_revenue)} TND</div>
                <p className="text-xs text-white/70">Revenus totaux</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">CA Aujourd'hui</CardTitle>
                <TrendingUp className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{safeToFixed(stats?.today_revenue)} TND</div>
                <p className="text-xs text-white/70">Revenus du jour</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Commandes</CardTitle>
                <ShoppingCart className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.total_orders || 0}</div>
                <p className="text-xs text-white/70">Commandes totales</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Visiteurs</CardTitle>
                <Users className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.total_visitors || 0}</div>
                <p className="text-xs text-white/70">Visiteurs uniques</p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Commandes en Attente</CardTitle>
                <Clock className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.pending_orders || 0}</div>
                <p className="text-xs text-white/70">À traiter</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Visiteurs Aujourd'hui</CardTitle>
                <Eye className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">{stats?.today_visitors || 0}</div>
                <p className="text-xs text-white/70">Visiteurs du jour</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Pays Top</CardTitle>
                <Globe className="h-5 w-5 text-white/70" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl sm:text-3xl font-bold text-white">
                  {stats?.top_countries?.[0]?.country || 'N/A'}
                </div>
                <p className="text-xs text-white/70">
                  {stats?.top_countries?.[0]?.visitors || 0} visiteurs
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts and Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Visitor Growth Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Croissance des Visiteurs
                </CardTitle>
                <CardDescription>
                  Évolution du nombre de visiteurs (30 derniers jours)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.visitor_growth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="visitors" stroke="#212937" activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Revenue Growth Chart */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Euro className="mr-2 h-5 w-5" />
                  Croissance du Chiffre d'Affaires
                </CardTitle>
                <CardDescription>
                  Évolution des revenus (30 derniers jours)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.revenue_growth || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="revenue" stroke="#22c55e" activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Analytics */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Analyse des Appareils
                </CardTitle>
                <CardDescription>
                  Répartition des visiteurs par type d'appareil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.device_analytics || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ device_type, percent }) => `${device_type} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="visitors"
                    >
                      {(stats?.device_analytics || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Top Countries */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center text-base sm:text-lg">
                  <Globe className="mr-2 h-5 w-5" />
                  Top Pays
                </CardTitle>
                <CardDescription>
                  Pays avec le plus de visiteurs
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={stats?.top_countries || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="visitors" fill="#212937" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Latest Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Package className="mr-2 h-5 w-5" />
                Dernières Commandes
              </CardTitle>
              <CardDescription>
                Commandes récentes - Cliquez pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {(stats?.latest_orders || []).map((order) => (
                  <div 
                    key={order.id_order} 
                    className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => handleOrderClick(order.id_order)}
                  >
                    <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                      <div className="bg-white p-2 rounded-full shadow-sm flex-shrink-0">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-sm sm:text-base truncate">{order.numero_commande}</p>
                        <p className="text-xs sm:text-sm text-gray-600 truncate">
                          {order.prenom_customer} {order.nom_customer}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date_creation_order).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="font-bold text-green-600 text-sm sm:text-base">{safeToFixed(order.total_order)} TND</p>
                      <div className="mt-1">
                        {getStatusBadge(order.status_order)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
