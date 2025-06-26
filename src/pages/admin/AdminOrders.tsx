import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import AdminLayout from '@/components/admin/AdminLayout';
import { Eye, Search, FileText, Package, Euro, TrendingUp, Calendar, Filter } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { fetchOrderDetails, type OrderDetails } from '@/services/orderDetailsService';
import { generateOrderReceiptPDF } from '@/utils/orderReceiptGenerator';
import { StatusFilter } from '@/components/admin/filters/StatusFilter';
import { DateFilter } from '@/components/admin/filters/DateFilter';

// Enhanced helper function to safely convert to number and format
const safeToFixed = (value: any, decimals: number = 2): string => {
  // Handle null, undefined, empty strings
  if (value === null || value === undefined || value === '') {
    return '0.00';
  }
  
  // Convert to string first, then to number to handle various input types
  const stringValue = String(value).trim();
  const num = parseFloat(stringValue);
  
  // Check if conversion resulted in NaN
  if (isNaN(num)) {
    console.warn('safeToFixed: Invalid numeric value:', value);
    return '0.00';
  }
  
  return num.toFixed(decimals);
};

// Enhanced helper function to safely get numeric value
const safeNumber = (value: any): number => {
  // Handle null, undefined, empty strings
  if (value === null || value === undefined || value === '') {
    return 0;
  }
  
  // Convert to string first, then to number to handle various input types
  const stringValue = String(value).trim();
  const num = parseFloat(stringValue);
  
  // Check if conversion resulted in NaN
  if (isNaN(num)) {
    console.warn('safeNumber: Invalid numeric value:', value);
    return 0;
  }
  
  return num;
};

// Safe order data transformation
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

// Update the interface to match what the API returns
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
    
    // Transform and validate all order data
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

  const handleGenerateReceipt = (order: CompleteOrder) => {
    try {
      // Convert CompleteOrder to OrderDetails format for PDF generation
      const orderForPDF: OrderDetails = {
        ...order,
        payment_method: order.payment_method || 'N/A',
        notes_order: order.notes_order || '',
        date_livraison_souhaitee: order.date_livraison_souhaitee || order.date_creation_order
      };
      generateOrderReceiptPDF(orderForPDF);
    } catch (error) {
      console.error('Error generating receipt:', error);
    }
  };

  // ... keep existing code (getStatusBadge function and statusOptions)

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
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-blue-900">Total Commandes</CardTitle>
                <Package className="h-5 w-5 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-900">{totalOrders}</div>
                <p className="text-xs text-blue-700 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Commandes filtrées
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-green-900">Chiffre d'Affaires</CardTitle>
                <Euro className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-900">€{safeToFixed(totalRevenue)}</div>
                <p className="text-xs text-green-700 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Revenus filtrés
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-yellow-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-yellow-900">En Attente</CardTitle>
                <Calendar className="h-5 w-5 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-900">{pendingOrders}</div>
                <p className="text-xs text-yellow-700">Commandes à traiter</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-purple-900">Livrées</CardTitle>
                <Package className="h-5 w-5 text-purple-600" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-900">{completedOrders}</div>
                <p className="text-xs text-purple-700">Commandes terminées</p>
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
                        <TableCell>€{safeToFixed(order.total_order)}</TableCell>
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
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleGenerateReceipt(order)}
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
              </div>
            </CardContent>
          </Card>

          {/* Order Details Dialog */}
          <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Détails de la Commande {selectedOrder?.numero_commande}</DialogTitle>
                <DialogDescription>
                  Informations complètes sur cette commande
                </DialogDescription>
              </DialogHeader>
              {selectedOrder && (
                <div className="space-y-6">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Informations Client</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>Nom:</strong> {selectedOrder.customer?.nom || 'N/A'}</p>
                        <p><strong>Prénom:</strong> {selectedOrder.customer?.prenom || 'N/A'}</p>
                        <p><strong>Email:</strong> {selectedOrder.customer?.email || 'N/A'}</p>
                        <p><strong>Téléphone:</strong> {selectedOrder.customer?.telephone || 'N/A'}</p>
                        <p><strong>Adresse:</strong> {selectedOrder.customer?.adresse || 'N/A'}</p>
                        <p><strong>Ville:</strong> {selectedOrder.customer?.ville || 'N/A'}</p>
                        <p><strong>Code Postal:</strong> {selectedOrder.customer?.code_postal || 'N/A'}</p>
                        <p><strong>Pays:</strong> {selectedOrder.customer?.pays || 'N/A'}</p>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Détails Commande</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <p><strong>N° Commande:</strong> {selectedOrder.numero_commande || 'N/A'}</p>
                        <p><strong>Date:</strong> {selectedOrder.date_creation_order ? new Date(selectedOrder.date_creation_order).toLocaleString('fr-FR') : 'N/A'}</p>
                        <p><strong>Statut:</strong> {getStatusBadge(selectedOrder.status_order || 'unknown')}</p>
                        <p><strong>Méthode de paiement:</strong> {selectedOrder.payment_method || 'N/A'}</p>
                        <p><strong>Notes:</strong> {selectedOrder.notes_order || 'Aucune note'}</p>
                        <p><strong>Date de livraison souhaitée:</strong> {
                          selectedOrder.date_livraison_souhaitee ? 
                          new Date(selectedOrder.date_livraison_souhaitee).toLocaleDateString('fr-FR') : 
                          'Non spécifiée'
                        }</p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Order Items */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Articles Commandés</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {(selectedOrder.items || []).map((item, index) => (
                          <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                            <div>
                              <p className="font-medium">{item.nom_product_snapshot || 'N/A'}</p>
                              <p className="text-sm text-gray-600">Ref: {item.reference_product_snapshot || 'N/A'}</p>
                              <p className="text-sm text-gray-600">
                                Taille: {item.size_selected || 'N/A'} - Couleur: {item.color_selected || 'N/A'}
                              </p>
                              <p className="text-sm text-gray-600">Quantité: {safeNumber(item.quantity_ordered)}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">€{safeToFixed(item.total_item)}</p>
                              <p className="text-sm text-gray-600">€{safeToFixed(item.price_product_snapshot)} / unité</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Order Summary */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Récapitulatif</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Sous-total:</span>
                          <span>€{safeToFixed(selectedOrder.sous_total_order)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Remise:</span>
                          <span>-€{safeToFixed(selectedOrder.discount_amount_order)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frais de livraison:</span>
                          <span>€{safeToFixed(selectedOrder.delivery_cost_order)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg border-t pt-2">
                          <span>Total:</span>
                          <span>€{safeToFixed(selectedOrder.total_order)}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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
