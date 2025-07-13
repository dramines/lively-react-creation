
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Search, FileText, Package, Euro, TrendingUp, Calendar, Filter, Download, User, MapPin, ShoppingBag, CreditCard, Phone, Mail } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { fetchOrderDetails, type OrderDetails } from '@/services/orderDetailsService';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { DateFilter } from '@/components/admin/filters/DateFilter';
import { getProductImage } from '@/utils/imageUtils';

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

const safeNumber = (value: any): number => {
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  const stringValue = String(value).trim();
  const num = parseFloat(stringValue);
  
  if (isNaN(num)) {
    console.warn('safeNumber: Invalid numeric value:', value);
    return 0;
  }
  
  return num;
};

const transformOrderData = (order: any): CompleteOrder => {
  return {
    ...order,
    id_order: safeNumber(order.id_order),
    sous_total_order: safeNumber(order.sous_total_order),
    discount_amount_order: safeNumber(order.discount_amount_order),
    discount_percentage_order: safeNumber(order.discount_percentage_order),
    delivery_cost_order: safeNumber(order.delivery_cost_order),
    total_order: safeNumber(order.total_order),
    vue_order: safeNumber(order.vue_order),
    customer: {
      nom: order.customer?.nom || order.nom_customer || '',
      prenom: order.customer?.prenom || order.prenom_customer || '',
      email: order.customer?.email || order.email_customer || '',
      telephone: order.customer?.telephone || order.telephone_customer || '',
      adresse: order.customer?.adresse || order.adresse_customer || '',
      ville: order.customer?.ville || order.ville_customer || '',
      code_postal: order.customer?.code_postal || order.code_postal_customer || '',
      pays: order.customer?.pays || order.pays_customer || ''
    },
    items: (order.items || []).map((item: any) => ({
      ...item,
      price_product_snapshot: safeNumber(item.price_product_snapshot),
      quantity_ordered: safeNumber(item.quantity_ordered),
      subtotal_item: safeNumber(item.subtotal_item),
      discount_item: safeNumber(item.discount_item),
      total_item: safeNumber(item.total_item)
    })),
    delivery_address: order.delivery_address || null
  };
};

export interface CompleteOrder {
  id_order: number;
  numero_commande: string;
  date_creation_order: string;
  sous_total_order: number;
  discount_amount_order: number;
  discount_percentage_order: number;
  delivery_cost_order: number;
  total_order: number;
  status_order: string;
  payment_method?: string;
  notes_order?: string;
  date_livraison_souhaitee?: string;
  payment_status: string;
  vue_order: number;
  customer: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    code_postal: string;
    pays: string;
  };
  items: Array<{
    nom_product_snapshot: string;
    reference_product_snapshot: string;
    price_product_snapshot: number;
    size_selected: string;
    color_selected: string;
    quantity_ordered: number;
    subtotal_item: number;
    discount_item: number;
    total_item: number;
    img_product?: string;
  }>;
  delivery_address?: {
    nom_destinataire: string;
    prenom_destinataire: string;
    telephone_destinataire: string;
    adresse_livraison: string;
    ville_livraison: string;
    code_postal_livraison: string;
    pays_livraison: string;
    instructions_livraison: string;
  };
}

const fetchAllOrders = async (): Promise<CompleteOrder[]> => {
  try {
    const response = await axios.get('https://draminesaid.com/lucci/api/get_all_orders.php');
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch orders');
    }
    
    const orders = (response.data.data || []).map((order: any) => {
      console.log('Raw order data:', order);
      return transformOrderData(order);
    });
    
    console.log('Transformed orders:', orders);
    return orders;
  } catch (error) {
    console.error('Error fetching orders:', error);
    throw error;
  }
};

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<CompleteOrder | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [receiptLanguage, setReceiptLanguage] = useState<'fr' | 'en'>('fr');

  const { data: orders = [], isLoading, error, refetch } = useQuery({
    queryKey: ['adminOrders'],
    queryFn: fetchAllOrders,
    refetchInterval: 30000,
  });

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      (order.numero_commande || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.nom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.prenom || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer?.email || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status_order === statusFilter;

    const matchesDate = (() => {
      if (dateFilter === 'all') return true;
      
      const orderDate = new Date(order.date_creation_order);
      const today = new Date();
      
      switch (dateFilter) {
        case 'today':
          return orderDate.toDateString() === today.toDateString();
        case 'week':
          const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        case 'month':
          const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        default:
          return true;
      }
    })();

    return matchesSearch && matchesStatus && matchesDate;
  });

  const totalOrders = filteredOrders.length;
  const totalRevenue = filteredOrders.reduce((sum, order) => sum + safeNumber(order.total_order), 0);
  const pendingOrders = filteredOrders.filter(order => order.status_order === 'pending').length;
  const completedOrders = filteredOrders.filter(order => order.status_order === 'delivered').length;

  const handleViewDetails = async (order: CompleteOrder) => {
    try {
      const orderDetails = await fetchOrderDetails(order.id_order.toString());
      setSelectedOrder({
        ...order,
        payment_method: orderDetails.payment_method || 'N/A',
        notes_order: orderDetails.notes_order || '',
        date_livraison_souhaitee: orderDetails.date_livraison_souhaitee || order.date_creation_order
      });
      setIsDetailsOpen(true);
    } catch (error) {
      console.error('Error fetching order details:', error);
      setSelectedOrder(order);
      setIsDetailsOpen(true);
    }
  };

  const handleGenerateReceipt = (order: CompleteOrder, language: 'fr' | 'en' = 'fr') => {
    try {
      const orderForPDF: OrderDetails = {
        ...order,
        payment_method: order.payment_method || 'N/A',
        notes_order: order.notes_order || '',
        date_livraison_souhaitee: order.date_livraison_souhaitee || order.date_creation_order
      };
      generateOrderReceiptPDF(orderForPDF, language);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
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

  const statusOptions = [
    { value: 'all', label: 'Tous les statuts' },
    { value: 'pending', label: 'En attente' },
    { value: 'confirmed', label: 'Confirmée' },
    { value: 'processing', label: 'En traitement' },
    { value: 'shipped', label: 'Expédiée' },
    { value: 'delivered', label: 'Livrée' }
  ];

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement des commandes...</p>
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
            <p className="text-red-600">Erreur lors du chargement des commandes</p>
            <Button onClick={() => refetch()} className="mt-4">
              Réessayer
            </Button>
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
                  <Package className="mr-3 h-8 w-8 text-gray-700" />
                  Gestion des Commandes
                </h1>
                <p className="text-gray-600 mt-2">
                  Suivez et gérez toutes les commandes de votre boutique
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Total Commandes</CardTitle>
                <Package className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{totalOrders}</div>
                <p className="text-xs text-gray-300 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Commandes filtrées
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Chiffre d'Affaires</CardTitle>
                <Euro className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{safeToFixed(totalRevenue)} TND</div>
                <p className="text-xs text-gray-300 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Revenus filtrés
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">En Attente</CardTitle>
                <Calendar className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{pendingOrders}</div>
                <p className="text-xs text-gray-300">Commandes à traiter</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg" style={{ backgroundColor: '#212937' }}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white">Livrées</CardTitle>
                <Package className="h-5 w-5 text-white" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-white">{completedOrders}</div>
                <p className="text-xs text-gray-300">Commandes terminées</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Rechercher par numéro, nom, email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <StatusFilter
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                  options={statusOptions}
                />
                <DateFilter
                  value={dateFilter}
                  onValueChange={setDateFilter}
                />
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setDateFilter('all');
                  }}
                >
                  Réinitialiser
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle>Liste des Commandes ({filteredOrders.length})</CardTitle>
              <CardDescription>
                Cliquez sur une commande pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>N° Commande</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <TableRow key={order.id_order} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {order.numero_commande || 'N/A'}
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {order.customer?.prenom || ''} {order.customer?.nom || ''}
                            </div>
                            <div className="text-sm text-gray-500">
                              {order.customer?.email || ''}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {order.date_creation_order ? new Date(order.date_creation_order).toLocaleDateString('fr-FR') : 'N/A'}
                        </TableCell>
                        <TableCell>{safeToFixed(order.total_order)} TND</TableCell>
                        <TableCell>
                          {getStatusBadge(order.status_order || 'unknown')}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleViewDetails(order)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Voir
                            </Button>
                            <div className="flex items-center space-x-1">
                              <Select value={receiptLanguage} onValueChange={(value: 'fr' | 'en') => setReceiptLanguage(value)}>
                                <SelectTrigger className="w-16 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fr">FR</SelectItem>
                                  <SelectItem value="en">EN</SelectItem>
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleGenerateReceipt(order, receiptLanguage)}
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Reçu
                              </Button>
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Enhanced Order Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-7xl max-h-[95vh] overflow-y-auto bg-white p-0">
              <DialogHeader className="p-6 border-b border-gray-200">
                <DialogTitle className="text-2xl font-bold flex items-center" style={{ color: '#212937' }}>
                  <Package className="mr-3 h-6 w-6" />
                  Commande {selectedOrder?.numero_commande}
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Informations détaillées et complètes de la commande
                </DialogDescription>
              </DialogHeader>
              
              {selectedOrder && (
                <div className="p-6 space-y-8">
                  {/* Order Overview Section */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center text-gray-900">
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Statut de la Commande
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-center">
                          {getStatusBadge(selectedOrder.status_order || 'unknown')}
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Créée le</p>
                          <p className="font-semibold text-gray-900">
                            {selectedOrder.date_creation_order ? 
                              new Date(selectedOrder.date_creation_order).toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              }) : 'N/A'
                            }
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Livraison souhaitée</p>
                          <p className="font-semibold text-gray-900">
                            {selectedOrder.date_livraison_souhaitee ? 
                              new Date(selectedOrder.date_livraison_souhaitee).toLocaleDateString('fr-FR') : 
                              'Non spécifiée'
                            }
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center text-gray-900">
                          <CreditCard className="mr-2 h-5 w-5" />
                          Paiement
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">Méthode</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.payment_method || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Statut</p>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {selectedOrder.payment_status || 'N/A'}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total</p>
                          <p className="text-2xl font-bold text-green-600">{safeToFixed(selectedOrder.total_order)} TND</p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-lg flex items-center text-gray-900">
                          <Package className="mr-2 h-5 w-5" />
                          Détails Commande
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <p className="text-sm text-gray-600">N° Commande</p>
                          <p className="font-bold text-lg text-gray-900">{selectedOrder.numero_commande || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Articles</p>
                          <p className="font-semibold text-gray-900">{selectedOrder.items?.length || 0} article(s)</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Frais de livraison</p>
                          <p className="font-semibold text-gray-900">{safeToFixed(selectedOrder.delivery_cost_order)} TND</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Customer Information */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center text-gray-900">
                        <User className="mr-2 h-5 w-5" />
                        Informations Client
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-600">Nom complet</p>
                            <p className="text-lg font-semibold text-gray-900">
                              {selectedOrder.customer?.prenom || 'N/A'} {selectedOrder.customer?.nom || 'N/A'}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600 flex items-center">
                              <Mail className="mr-1 h-4 w-4" />
                              Email
                            </p>
                            <p className="font-semibold text-blue-600">{selectedOrder.customer?.email || 'N/A'}</p>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm font-medium text-gray-600 flex items-center">
                              <Phone className="mr-1 h-4 w-4" />
                              Téléphone
                            </p>
                            <p className="font-semibold text-gray-900">{selectedOrder.customer?.telephone || 'N/A'}</p>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-600">Pays</p>
                            <p className="font-semibold text-gray-900">{selectedOrder.customer?.pays || 'N/A'}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-600 flex items-center">
                            <MapPin className="mr-1 h-4 w-4" />
                            Adresse
                          </p>
                          <p className="font-semibold text-gray-900">{selectedOrder.customer?.adresse || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{selectedOrder.customer?.ville || ''} {selectedOrder.customer?.code_postal || ''}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Delivery Address */}
                  {selectedOrder.delivery_address && (
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center text-gray-900">
                          <MapPin className="mr-2 h-5 w-5" />
                          Adresse de Livraison
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Destinataire</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {selectedOrder.delivery_address.prenom_destinataire} {selectedOrder.delivery_address.nom_destinataire}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-600">Téléphone</p>
                              <p className="font-semibold text-gray-900">{selectedOrder.delivery_address.telephone_destinataire}</p>
                            </div>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <p className="text-sm font-medium text-gray-600">Adresse complète</p>
                              <p className="font-semibold text-gray-900">{selectedOrder.delivery_address.adresse_livraison}</p>
                              <p className="text-sm text-gray-600">
                                {selectedOrder.delivery_address.ville_livraison} {selectedOrder.delivery_address.code_postal_livraison}, {selectedOrder.delivery_address.pays_livraison}
                              </p>
                            </div>
                            {selectedOrder.delivery_address.instructions_livraison && (
                              <div>
                                <p className="text-sm font-medium text-gray-600">Instructions</p>
                                <p className="font-semibold text-gray-900 bg-gray-50 p-3 rounded-md">
                                  {selectedOrder.delivery_address.instructions_livraison}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Order Items */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center text-gray-900">
                        <Package className="mr-2 h-5 w-5" />
                        Articles Commandés ({selectedOrder.items?.length || 0} articles)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(selectedOrder.items || []).map((item, index) => (
                          <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border">
                            <div className="flex-shrink-0">
                              <img
                                src={getProductImage(item.img_product || '', item.reference_product_snapshot)}
                                alt={item.nom_product_snapshot}
                                className="w-20 h-20 object-cover rounded-md border border-gray-200 shadow-sm"
                                onError={(e) => {
                                  e.currentTarget.src = '/lovable-uploads/1e127b10-9a18-47a3-b8df-ff0d939224ba.png';
                                }}
                              />
                            </div>
                            <div className="flex-grow">
                              <h4 className="font-semibold text-lg text-gray-900 mb-2">{item.nom_product_snapshot || 'N/A'}</h4>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                                <div>
                                  <span className="text-gray-600 font-medium">Référence:</span>
                                  <p className="font-semibold text-gray-900">{item.reference_product_snapshot || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">Taille:</span>
                                  <p className="font-semibold text-gray-900">{item.size_selected || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">Couleur:</span>
                                  <p className="font-semibold text-gray-900">{item.color_selected || 'N/A'}</p>
                                </div>
                                <div>
                                  <span className="text-gray-600 font-medium">Quantité:</span>
                                  <p className="font-bold text-gray-900">{safeNumber(item.quantity_ordered)}</p>
                                </div>
                              </div>
                            </div>
                            <div className="text-right flex-shrink-0">
                              <p className="font-bold text-xl text-green-600">{safeToFixed(item.total_item)} TND</p>
                              <p className="text-sm text-gray-600">{safeToFixed(item.price_product_snapshot)} TND / unité</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card className="border border-gray-200">
                    <CardHeader>
                      <CardTitle className="text-xl flex items-center text-gray-900">
                        <Euro className="mr-2 h-5 w-5" />
                        Récapitulatif Financier
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <div className="space-y-4">
                          <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-700">Sous-total:</span>
                            <span className="font-semibold text-gray-900">{safeToFixed(selectedOrder.sous_total_order)} TND</span>
                          </div>
                          {selectedOrder.discount_amount_order > 0 && (
                            <div className="flex justify-between items-center text-lg text-red-600">
                              <span>Remise ({safeToFixed(selectedOrder.discount_percentage_order)}%):</span>
                              <span className="font-semibold">-{safeToFixed(selectedOrder.discount_amount_order)} TND</span>
                            </div>
                          )}
                          <div className="flex justify-between items-center text-lg">
                            <span className="text-gray-700">Frais de livraison:</span>
                            <span className="font-semibold text-gray-900">{safeToFixed(selectedOrder.delivery_cost_order)} TND</span>
                          </div>
                          <div className="border-t border-gray-300 pt-4">
                            <div className="flex justify-between items-center text-2xl font-bold text-green-600">
                              <span>Total:</span>
                              <span>{safeToFixed(selectedOrder.total_order)} TND</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Notes Section */}
                  {selectedOrder.notes_order && (
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="text-xl flex items-center text-gray-900">
                          <FileText className="mr-2 h-5 w-5" />
                          Notes de Commande
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                          <p className="text-gray-900 font-medium">{selectedOrder.notes_order}</p>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Action Buttons */}
                  <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <Select value={receiptLanguage} onValueChange={(value: 'fr' | 'en') => setReceiptLanguage(value)}>
                        <SelectTrigger className="w-32 bg-white border-gray-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-white border-gray-300">
                          <SelectItem value="fr">Français</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        onClick={() => handleGenerateReceipt(selectedOrder, receiptLanguage)}
                        style={{ backgroundColor: '#212937' }}
                        className="text-white hover:opacity-90"
                        size="lg"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger le Reçu
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
