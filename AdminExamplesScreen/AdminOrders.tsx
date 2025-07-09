import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Search, FileText, Package, DollarSign, TrendingUp, Calendar, Filter, Download, User, MapPin, ShoppingBag, CreditCard, Phone, Mail } from 'lucide-react';
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
                  Suivez et gérez toutes les commandes de votre boutique Spada Di Battiglia
                </p>
              </div>
              <Button onClick={() => refetch()} variant="outline">
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <Package className="mr-2 h-4 w-4 inline" />
                  Total Commandes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalOrders}</div>
                <p className="text-xs text-muted-foreground">
                  Commandes filtrées
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium">
                   <DollarSign className="mr-2 h-4 w-4 inline" />
                   Chiffre d'Affaires
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{safeToFixed(totalRevenue)} TND</div>
                <p className="text-xs text-muted-foreground">
                  Revenus filtrés
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <Calendar className="mr-2 h-4 w-4 inline" />
                  En Attente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingOrders}</div>
                <p className="text-xs text-muted-foreground">Commandes à traiter</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  <TrendingUp className="mr-2 h-4 w-4 inline" />
                  Livrées
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{completedOrders}</div>
                <p className="text-xs text-muted-foreground">Commandes terminées</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2 h-5 w-5" />
                Filtres et Recherche
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Rechercher par numéro, nom, email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <StatusFilter value={statusFilter} onChange={setStatusFilter} options={statusOptions} />
                <DateFilter value={dateFilter} onChange={setDateFilter} />
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
          <Card>
            <CardHeader>
              <CardTitle>Liste des Commandes ({filteredOrders.length})</CardTitle>
              <CardDescription>
                Cliquez sur une commande pour voir les détails
              </CardDescription>
            </CardHeader>
            <CardContent>
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
                    <TableRow key={order.id_order}>
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
                        <div className="flex items-center space-x-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(order)}
                              >
                                <Eye className="h-4 w-4 mr-1" />
                                Voir
                              </Button>
                            </DialogTrigger>
                          </Dialog>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleGenerateReceipt(order, 'fr')}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Reçu
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Order Details Modal */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Commande {selectedOrder?.numero_commande}
                </DialogTitle>
                <DialogDescription>
                  SPADA DI BATTIGLIA - Boutique de Mode Premium
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {selectedOrder && (
                  <>
                    {/* Order Status Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Package className="mr-2 h-4 w-4" />
                            Statut de la Commande
                          </CardTitle>
                          {getStatusBadge(selectedOrder.status_order || 'unknown')}
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Créée le</span>
                            </div>
                            <div className="text-sm">
                              {selectedOrder.date_creation_order ? 
                                new Date(selectedOrder.date_creation_order).toLocaleDateString('fr-FR') : 'N/A'
                              }
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="font-medium">Livraison souhaitée</span>
                            </div>
                            <div className="text-sm">
                              {new Date(selectedOrder.date_livraison_souhaitee).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <CreditCard className="mr-2 h-4 w-4" />
                            Paiement
                          </CardTitle>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Méthode:</span>
                              <span className="text-sm">{selectedOrder.payment_method || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Statut:</span>
                              <span className="text-sm">{selectedOrder.payment_status || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Total:</span>
                              <span className="text-sm font-bold">{safeToFixed(selectedOrder.total_order)} TND</span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Détails
                          </CardTitle>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">N° Commande:</span>
                              <span className="text-sm">{selectedOrder.numero_commande || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Articles:</span>
                              <span className="text-sm">{selectedOrder.items?.length || 0}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm">Livraison:</span>
                              <span className="text-sm">{safeToFixed(selectedOrder.delivery_cost_order)} TND</span>
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    </div>

                    {/* Customer and Delivery Information */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5" />
                            Informations Client
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Nom complet:</span>
                              <span className="text-right">
                                {selectedOrder.customer?.prenom || 'N/A'} {selectedOrder.customer?.nom || 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Email:</span>
                              <span className="text-right">{selectedOrder.customer?.email || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Téléphone:</span>
                              <span className="text-right">{selectedOrder.customer?.telephone || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="space-y-3 mt-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Adresse:</span>
                              <span className="text-right">{selectedOrder.customer?.adresse || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Ville:</span>
                              <span className="text-right">{selectedOrder.customer?.ville || ''} {selectedOrder.customer?.code_postal || ''}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Pays:</span>
                              <span className="text-right">{selectedOrder.customer?.pays || 'N/A'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <MapPin className="mr-2 h-5 w-5" />
                            Adresse de Livraison
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="font-medium">Destinataire:</span>
                              <span className="text-right">
                                {selectedOrder.delivery_address?.prenom_destinataire || selectedOrder.customer?.prenom} {selectedOrder.delivery_address?.nom_destinataire || selectedOrder.customer?.nom}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Téléphone:</span>
                              <span className="text-right">{selectedOrder.delivery_address?.telephone_destinataire || selectedOrder.customer?.telephone || 'N/A'}</span>
                            </div>
                          </div>
                          <div className="space-y-3 mt-4">
                            <div className="flex justify-between">
                              <span className="font-medium">Adresse:</span>
                              <span className="text-right">{selectedOrder.delivery_address?.adresse_livraison || selectedOrder.customer?.adresse || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Ville:</span>
                              <span className="text-right">{selectedOrder.delivery_address?.ville_livraison || selectedOrder.customer?.ville || ''} {selectedOrder.delivery_address?.code_postal_livraison || selectedOrder.customer?.code_postal || ''}, {selectedOrder.delivery_address?.pays_livraison || selectedOrder.customer?.pays || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="font-medium">Instructions:</span>
                              <span className="text-right">{selectedOrder.delivery_address?.instructions_livraison || 'Aucune instruction spéciale'}</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Order Items */}
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Package className="mr-2 h-5 w-5" />
                          Articles Commandés ({selectedOrder.items?.length || 0} articles)
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Article</TableHead>
                                <TableHead>Référence</TableHead>
                                <TableHead>Taille</TableHead>
                                <TableHead>Couleur</TableHead>
                                <TableHead>Quantité</TableHead>
                                <TableHead>Prix</TableHead>
                                <TableHead>Total</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {selectedOrder.items.map((item, index) => (
                                <TableRow key={index}>
                                  <TableCell>
                                    <div className="flex items-center space-x-3">
                                      <div className="flex-shrink-0">
                                        <img
                                          className="h-10 w-10 rounded-full object-cover"
                                          src={getProductImage(item.img_product)}
                                          alt={item.nom_product_snapshot || 'Product'}
                                        />
                                      </div>
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">
                                          {item.nom_product_snapshot || 'N/A'}
                                        </div>
                                      </div>
                                    </div>
                                  </TableCell>
                                  <TableCell>{item.reference_product_snapshot || 'N/A'}</TableCell>
                                  <TableCell>{item.size_selected || 'N/A'}</TableCell>
                                  <TableCell>{item.color_selected || 'N/A'}</TableCell>
                                  <TableCell>{safeNumber(item.quantity_ordered)}</TableCell>
                                  <TableCell>{safeToFixed(item.price_product_snapshot)} TND</TableCell>
                                  <TableCell>{safeToFixed(item.total_item)} TND</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Financial Summary */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Récapitulatif Financier</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Sous-total:</span>
                            <span>{safeToFixed(selectedOrder.sous_total_order)} TND</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Remise ({safeToFixed(selectedOrder.discount_percentage_order)}%):</span>
                            <span>-{safeToFixed(selectedOrder.discount_amount_order)} TND</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Frais de livraison:</span>
                            <span>{safeToFixed(selectedOrder.delivery_cost_order)} TND</span>
                          </div>
                          <div className="flex justify-between font-bold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>{safeToFixed(selectedOrder.total_order)} TND</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Order Notes */}
                    <Card>
                      <CardHeader>
                        <CardTitle>Notes de Commande</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-gray-600">
                          {selectedOrder.notes_order || 'Aucune note'}
                        </p>
                      </CardContent>
                    </Card>

                    {/* Action Buttons */}
                    <Card>
                      <CardContent className="pt-6">
                        <div className="flex flex-wrap gap-4">
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleGenerateReceipt(selectedOrder, 'fr')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              PDF FR
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => handleGenerateReceipt(selectedOrder, 'en')}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Télécharger le Reçu
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;