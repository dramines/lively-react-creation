
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import AdminLayout from '@/components/admin/AdminLayout';
import { Users, Package, TrendingUp, Calendar, Eye, MessageSquare, Mail, UserCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface AdminStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_reservations: number;
  total_messages: number;
  total_newsletter: number;
  recent_orders: Array<{
    id_order: number;
    numero_commande: string;
    date_creation_order: string;
    total_order: number;
    status_order: string;
    prenom_customer: string;
    nom_customer: string;
  }>;
}

interface VisitorStats {
  total_visitors: number;
  total_page_views: number;
  unique_visitors: number;
  bounce_rate: number;
  avg_session_duration: number;
  top_pages: Array<{
    page: string;
    views: number;
  }>;
  visitor_trends: Array<{
    date: string;
    visitors: number;
    page_views: number;
  }>;
}

const fetchAdminStats = async (): Promise<AdminStats> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_admin_stats.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch admin stats');
  }
  return response.data.data;
};

const fetchVisitorStats = async (): Promise<VisitorStats> => {
  const response = await axios.get('https://draminesaid.com/lucci/api/get_visitor_stats.php');
  if (!response.data.success) {
    throw new Error(response.data.message || 'Failed to fetch visitor stats');
  }
  return response.data.data;
};

const AdminDashboard = () => {
  const { data: stats, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ['adminStats'],
    queryFn: fetchAdminStats,
    refetchInterval: 30000,
  });

  const { data: visitorStats, isLoading: visitorLoading, error: visitorError } = useQuery({
    queryKey: ['visitorStats'],
    queryFn: fetchVisitorStats,
    refetchInterval: 60000,
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

  if (statsLoading || visitorLoading) {
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

  if (statsError || visitorError) {
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
          <div className="px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-playfair font-bold text-gray-900 flex items-center">
                  <TrendingUp className="mr-3 h-8 w-8 text-gray-700" />
                  Tableau de Bord
                </h1>
                <p className="text-gray-600 mt-2">
                  Vue d'ensemble de votre boutique LUCCI BY E.Y
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Main Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Produits</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{stats?.total_products || 0}</div>
                <p className="text-xs text-blue-700">Articles en catalogue</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Commandes</CardTitle>
                <Package className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">{stats?.total_orders || 0}</div>
                <p className="text-xs text-green-700">Commandes totales</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Clients</CardTitle>
                <Users className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{stats?.total_customers || 0}</div>
                <p className="text-xs text-purple-700">Clients enregistrés</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-orange-900">Réservations</CardTitle>
                <Calendar className="h-5 w-5 text-orange-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-900">{stats?.total_reservations || 0}</div>
                <p className="text-xs text-orange-700">Rendez-vous programmés</p>
              </CardContent>
            </Card>
          </div>

          {/* Visitor Stats */}
          {visitorStats && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-indigo-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-indigo-900">Visiteurs</CardTitle>
                  <Eye className="h-5 w-5 text-indigo-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-indigo-900">{visitorStats.total_visitors || 0}</div>
                  <p className="text-xs text-indigo-700">Visiteurs totaux</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-pink-50 to-pink-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-pink-900">Pages vues</CardTitle>
                  <Eye className="h-5 w-5 text-pink-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-pink-900">{visitorStats.total_page_views || 0}</div>
                  <p className="text-xs text-pink-700">Vues de pages</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-50 to-teal-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-teal-900">Messages</CardTitle>
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-900">{stats?.total_messages || 0}</div>
                  <p className="text-xs text-teal-700">Messages reçus</p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-yellow-900">Newsletter</CardTitle>
                  <Mail className="h-5 w-5 text-yellow-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-900">{stats?.total_newsletter || 0}</div>
                  <p className="text-xs text-yellow-700">Abonnés newsletter</p>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Recent Orders */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Commandes Récentes
              </CardTitle>
              <CardDescription>
                Dernières commandes passées sur votre boutique
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {(stats?.recent_orders || []).slice(0, 5).map((order) => (
                  <div key={order.id_order} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <Package className="h-4 w-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-semibold">{order.numero_commande}</p>
                        <p className="text-sm text-gray-600">
                          {order.prenom_customer} {order.nom_customer}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(order.date_creation_order).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">€{safeToFixed(order.total_order)}</p>
                      {getStatusBadge(order.status_order)}
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
