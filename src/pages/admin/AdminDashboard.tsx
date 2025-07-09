
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Users, 
  Package, 
  ShoppingCart, 
  TrendingUp,
  MessageSquare,
  Mail,
  Euro,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  total_revenue: number;
  today_revenue: number;
  total_orders: number;
  pending_orders: number;
  total_visitors: number;
  today_visitors: number;
  total_products: number;
  total_customers: number;
  total_messages: number;
  unread_messages: number;
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

// Helper function to safely format numbers
const safeToFixed = (value: any, decimals: number = 2): string => {
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  const num = parseFloat(String(value));
  if (isNaN(num)) {
    return '0.00';
  }
  
  return num.toFixed(decimals);
};

// Helper function to safely get customer initials
const getCustomerInitial = (nom?: string, prenom?: string): string => {
  if (nom && typeof nom === 'string' && nom.length > 0) {
    return nom.charAt(0).toUpperCase();
  }
  if (prenom && typeof prenom === 'string' && prenom.length > 0) {
    return prenom.charAt(0).toUpperCase();
  }
  return 'C'; // Default to 'C' for Customer
};

// Helper function to safely get customer name
const getCustomerName = (nom?: string, prenom?: string): string => {
  const safeName = nom && typeof nom === 'string' ? nom : '';
  const safePrenom = prenom && typeof prenom === 'string' ? prenom : '';
  
  if (safeName && safePrenom) {
    return `${safeName} ${safePrenom}`;
  } else if (safeName) {
    return safeName;
  } else if (safePrenom) {
    return safePrenom;
  }
  return 'Client';
};

const StatCard = ({ 
  title, 
  value, 
  description, 
  icon: Icon,
  trend,
  trendValue,
  className = ""
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend?: 'up' | 'down';
  trendValue?: string;
  className?: string;
}) => (
  <Card className={`hover:shadow-lg transition-all duration-300 ${className}`}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
        <Icon className="h-4 w-4 text-primary" />
      </div>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="flex items-center text-xs text-muted-foreground">
        {trend && trendValue && (
          <div className={`flex items-center mr-2 ${trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            <span className="ml-1">{trendValue}</span>
          </div>
        )}
        <span>{description}</span>
      </div>
    </CardContent>
  </Card>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      // Try multiple API endpoints in case of redirect issues
      const apiUrls = [
        'https://draminesaid.com/lucci/api/get_dashboard_stats.php',
        'https://www.draminesaid.com/lucci/api/get_dashboard_stats.php'
      ];
      
      let data = null;
      let success = false;
      
      for (const url of apiUrls) {
        try {
          console.log(`Trying API URL: ${url}`);
          const response = await fetch(url);
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            data = await response.json();
            console.log('API Response:', data);
            success = true;
            break;
          }
        } catch (error) {
          console.error(`Error with ${url}:`, error);
          continue;
        }
      }
      
      if (success && data?.success) {
        setStats(data.data);
      } else {
        // Fallback to mock data if API fails
        console.log('Using fallback data due to API failure');
        setStats({
          total_revenue: 0,
          today_revenue: 0,
          total_orders: 0,
          pending_orders: 0,
          total_visitors: 0,
          today_visitors: 0,
          total_products: 0,
          total_customers: 0,
          total_messages: 0,
          unread_messages: 0,
          latest_orders: []
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
      // Set fallback empty stats
      setStats({
        total_revenue: 0,
        today_revenue: 0,
        total_orders: 0,
        pending_orders: 0,
        total_visitors: 0,
        today_visitors: 0,
        total_products: 0,
        total_customers: 0,
        total_messages: 0,
        unread_messages: 0,
        latest_orders: []
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'confirmed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'shipped':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'confirmed':
        return 'Confirmée';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
          Tableau de bord
        </h1>
        <p className="text-muted-foreground text-lg">
          Vue d'ensemble de votre boutique en ligne
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Chiffre d'affaires"
          value={`€${safeToFixed(stats?.total_revenue)}`}
          description={`Aujourd'hui: €${safeToFixed(stats?.today_revenue)}`}
          icon={Euro}
          trend="up"
          trendValue="+12%"
          className="border-l-4 border-l-green-500"
        />
        <StatCard
          title="Commandes"
          value={stats?.total_orders?.toString() || '0'}
          description={`${stats?.pending_orders || 0} en attente`}
          icon={ShoppingCart}
          trend="up"
          trendValue="+8%"
          className="border-l-4 border-l-blue-500"
        />
        <StatCard
          title="Clients"
          value={stats?.total_customers?.toString() || '0'}
          description={`${stats?.today_visitors || 0} visiteurs aujourd'hui`}
          icon={Users}
          trend="up"
          trendValue="+3%"
          className="border-l-4 border-l-purple-500"
        />
        <StatCard
          title="Produits"
          value={stats?.total_products?.toString() || '0'}
          description="Produits actifs"
          icon={Package}
          className="border-l-4 border-l-orange-500"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders - Takes 2 columns */}
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Commandes récentes</CardTitle>
                <CardDescription>Les dernières commandes reçues</CardDescription>
              </div>
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats?.latest_orders && stats.latest_orders.length > 0 ? (
                stats.latest_orders.slice(0, 5).map((order) => (
                  <div key={order.id_order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                        {getCustomerInitial(order.nom_customer, order.prenom_customer)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {getCustomerName(order.nom_customer, order.prenom_customer)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Commande #{order.numero_commande || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="font-semibold text-gray-900">€{safeToFixed(order.total_order)}</p>
                      <Badge className={getStatusColor(order.status_order || 'pending')} variant="outline">
                        {getStatusText(order.status_order || 'pending')}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>Aucune commande récente</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Activity Summary - Takes 1 column */}
        <Card className="shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-semibold">Activité récente</CardTitle>
                <CardDescription>Résumé de votre boutique</CardDescription>
              </div>
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm font-medium">Visiteurs aujourd'hui</span>
                </div>
                <span className="text-lg font-bold text-blue-600">{stats?.today_visitors || 0}</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Euro className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm font-medium">Ventes aujourd'hui</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  €{safeToFixed(stats?.today_revenue)}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-amber-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="h-4 w-4 text-amber-600" />
                  </div>
                  <span className="text-sm font-medium">Commandes en attente</span>
                </div>
                <span className="text-lg font-bold text-amber-600">
                  {stats?.pending_orders || 0}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium">Messages non lus</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {stats?.unread_messages || 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
