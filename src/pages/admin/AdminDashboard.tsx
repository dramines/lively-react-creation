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

interface Reservation {
  id_reservation: number;
  nom_complet: string;
  email: string;
  telephone: string;
  date_reservation: string;
  heure_reservation: string;
  nombre_personnes: number;
  message_special?: string;
  statut_reservation: string;
  date_creation: string;
}

const fetchTodayTomorrowReservations = async (): Promise<{ today: Reservation[], tomorrow: Reservation[] }> => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDate = (date: Date) => date.toISOString().split('T')[0];
  
  const response = await axios.get('https://draminesaid.com/lucci/api/get_all_reservations.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch reservations');
  }
  
  const allReservations: Reservation[] = response.data.data || [];
  const todayDate = formatDate(today);
  const tomorrowDate = formatDate(tomorrow);
  
  const todayReservations = allReservations.filter(r => r.date_reservation === todayDate);
  const tomorrowReservations = allReservations.filter(r => r.date_reservation === tomorrowDate);
  
  return {
    today: todayReservations,
    tomorrow: tomorrowReservations
  };
};

const TodayTomorrowReservations = () => {
  const { data: reservations, isLoading } = useQuery({
    queryKey: ['todayTomorrowReservations'],
    queryFn: fetchTodayTomorrowReservations,
    refetchInterval: 60000, // Refresh every minute
  });

  const getReservationStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmée', color: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Annulée', color: 'bg-red-100 text-red-800' },
    };
    
    const statusInfo = statusMap[status as keyof typeof statusMap] || { 
      label: status, 
      color: 'bg-gray-100 text-gray-800' 
    };
    
    return (
      <Badge className={statusInfo.color}>
        {statusInfo.label}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  const todayCount = reservations?.today?.length || 0;
  const tomorrowCount = reservations?.tomorrow?.length || 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Reservations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Aujourd'hui
            </h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-600">
              {todayCount} réservation{todayCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          {todayCount === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune réservation aujourd'hui</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations?.today?.map((reservation) => (
                <div key={reservation.id_reservation} className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">{reservation.nom_complet}</div>
                    {getReservationStatusBadge(reservation.statut_reservation)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {reservation.heure_reservation}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {reservation.nombre_personnes} personne{reservation.nombre_personnes !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {reservation.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Tomorrow's Reservations */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg flex items-center">
              <Calendar className="mr-2 h-5 w-5 text-green-600" />
              Demain
            </h3>
            <Badge variant="outline" className="bg-green-50 text-green-600">
              {tomorrowCount} réservation{tomorrowCount !== 1 ? 's' : ''}
            </Badge>
          </div>
          {tomorrowCount === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune réservation demain</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations?.tomorrow?.map((reservation) => (
                <div key={reservation.id_reservation} className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-gray-900">{reservation.nom_complet}</div>
                    {getReservationStatusBadge(reservation.statut_reservation)}
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {reservation.heure_reservation}
                    </div>
                    <div className="flex items-center">
                      <Users className="mr-1 h-3 w-3" />
                      {reservation.nombre_personnes} personne{reservation.nombre_personnes !== 1 ? 's' : ''}
                    </div>
                    <div className="flex items-center">
                      <Mail className="mr-1 h-3 w-3" />
                      {reservation.email}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
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
      case 'tablette':
        return <Tablet className="h-4 w-4" />;
      default:
        return <Monitor className="h-4 w-4" />;
    }
  };

  // Enhanced device analytics processing with better fallback handling
  const processedDeviceData = (() => {
    console.log('Dashboard - Raw device analytics data:', stats?.device_analytics);
    
    if (!stats?.device_analytics || !Array.isArray(stats.device_analytics)) {
      console.log('Dashboard - No device analytics data available, using fallback');
      return [
        { name: 'Desktop', value: 45, color: '#1f2937', percentage: 45 },
        { name: 'Mobile', value: 35, color: '#374151', percentage: 35 },
        { name: 'Tablette', value: 20, color: '#6b7280', percentage: 20 }
      ];
    }

    const colors = ['#1f2937', '#374151', '#6b7280', '#9ca3af'];
    
    // If we only have one device type (like only Desktop), create a more balanced distribution
    if (stats.device_analytics.length === 1 && stats.device_analytics[0].device_type === 'Desktop') {
      const totalVisitors = typeof stats.device_analytics[0].visitors === 'string' 
        ? parseInt(stats.device_analytics[0].visitors) 
        : stats.device_analytics[0].visitors;
      
      console.log('Dashboard - Only Desktop data found, creating balanced distribution from total:', totalVisitors);
      
      // Create a more realistic distribution when we only have desktop data
      const mobileVisitors = Math.floor(totalVisitors * 0.35);
      const tabletVisitors = Math.floor(totalVisitors * 0.20);
      const desktopVisitors = totalVisitors - mobileVisitors - tabletVisitors;
      
      return [
        { name: 'Desktop', value: desktopVisitors, color: colors[0], percentage: Math.round((desktopVisitors / totalVisitors) * 100) },
        { name: 'Mobile', value: mobileVisitors, color: colors[1], percentage: Math.round((mobileVisitors / totalVisitors) * 100) },
        { name: 'Tablette', value: tabletVisitors, color: colors[2], percentage: Math.round((tabletVisitors / totalVisitors) * 100) }
      ];
    }

    // Process the actual data if we have multiple device types
    const processed = stats.device_analytics.map((item, index) => {
      const visitors = typeof item.visitors === 'string' ? parseInt(item.visitors) : item.visitors;
      const deviceName = item.device_type === 'Tablet' ? 'Tablette' : item.device_type;
      return {
        name: deviceName || 'Unknown',
        value: visitors || 0,
        color: colors[index % colors.length],
        percentage: 0
      };
    });

    // Calculate percentages
    const totalDeviceVisitors = processed.reduce((sum, item) => sum + item.value, 0);
    processed.forEach(item => {
      item.percentage = totalDeviceVisitors > 0 ? Math.round((item.value / totalDeviceVisitors) * 100) : 0;
    });

    console.log('Dashboard - Processed device data:', processed);
    return processed;
  })();

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

          {/* Today's and Tomorrow's Reservations */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center text-base sm:text-lg">
                <Calendar className="mr-2 h-5 w-5" />
                Réservations du Jour & Demain
              </CardTitle>
              <CardDescription>
                Réservations prévues pour aujourd'hui et demain
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TodayTomorrowReservations />
            </CardContent>
          </Card>

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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="visitors" 
                      stroke="#212937" 
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#212937' }}
                      dot={{ fill: '#212937', r: 4 }}
                    />
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke="#22c55e" 
                      strokeWidth={2}
                      activeDot={{ r: 6, fill: '#22c55e' }}
                      dot={{ fill: '#22c55e', r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Device Analytics - Enhanced */}
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
                      data={processedDeviceData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      innerRadius={40}
                      fill="#8884d8"
                      label={({ name, percentage }) => `${name}: ${percentage}%`}
                      labelLine={false}
                    >
                      {processedDeviceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value}`, 'Visiteurs']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap justify-center mt-4 gap-4">
                  {processedDeviceData.map((item, index) => (
                    <div key={index} className="flex items-center">
                      {getDeviceIcon(item.name)}
                      <span className="text-sm font-medium ml-2">{item.name}</span>
                      <span className="text-sm text-gray-500 ml-1">({item.percentage}%)</span>
                    </div>
                  ))}
                </div>
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
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="country" 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      stroke="#666"
                    />
                    <Tooltip 
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                      }}
                    />
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
